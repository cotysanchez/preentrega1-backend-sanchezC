const passport = require('passport');
const local = require('passport-local');
const UserModel = require('../dao/models/user.model.js');
const { createHash, isValidPassword } = require('../utils/hashBcrypt.js');
const GitHubStrategy = require('passport-github2');
const configObject = require('../config/config.js');
const CartRepository = require('../repository/cartRepository.js');
const cartRepository = new CartRepository();
const LocalStrategy = local.Strategy;
const jwt = require('passport-jwt');
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['coderCookieToken'];
  }
  return token;
};

//Estrategia para el Registro
const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const userExist = await UserModel.findOne({ email });
          if (userExist) return done(null, false);

          const newCart = await cartRepository.createCart();

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
            role: 'user',
          };

          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Estrategia para Login
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          //verificamos si existe un usuario con ese email
          const userExist = await UserModel.findOne({ email });
          if (!userExist) return done(null, false);
          //si existe verifico el password
          if (!isValidPassword(password, userExist)) return done(null, false);
          return done(null, userExist);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Serializacion
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  //Deserializacion
  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  //Estrategia Login con GitHub
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv1.07a16becc7796695',
        clientSecret: 'f91ebc135626d89d240dacc3de8b77c6a8ffb4cf',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Profile: ', profile);
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: '',
              age: 36,
              email: profile._json.email,
              password: '',
              cart: newCart._id,
            };
            //en base de datos creamos un nuevo user
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), 
        secretOrKey: "coderhouse"
    }, async (jwt_payload, done) => {
        try {
            // Busca el usuario en la base de datos usando el ID del payload JWT
            const user = await UserModel.findById(jwt_payload.user._id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user); 
        } catch (error) {
            return done(error);
        }
    }));

};

module.exports = initializePassport;
