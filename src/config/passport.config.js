const passport = require("passport");
const local = require ("passport-local");
const UserModel = require ("../dao/models/user.model.js");
const {createHash, isValidPassword}= require("../utils/hashBcrypt.js");

//Passport con GitHub
const GitHubStrategy= require ("passport-github2");


const LocalStrategy= local.Strategy;

const initializePassport= ()=>{
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
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
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

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const userExist = await UserModel.findOne({ email });
          if (!userExist) return done(null, false);
          if (!isValidPassword(password, userExist)) return done(null, false);
          return done(null, userExist);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  
  //Desarrollamos nueva estrategia con GitHub
  passport.use('github',new GitHubStrategy({
    clientID: 'Iv1.07a16becc7796695',
    clientSecret: "f91ebc135626d89d240dacc3de8b77c6a8ffb4cf",
    callbackURL:  "http://localhost:8080/api/sessions/githubcallback"
    } , async (accessToken, refreshToken, profile, done) => {
        console.log("Profile: ", profile);
        try {
            let user = await UserModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 18,
                    email: profile._json.email,
                    password: ""
                }
                //en base de datos creamos un nuevo user
                let result = await UserModel.create(newUser);
                done(null, result)
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))
        
}

module.exports= initializePassport;