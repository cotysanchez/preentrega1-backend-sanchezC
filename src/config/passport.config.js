const passport = require("passport");
const local = require ("passport-local");
const UserModel = require ("../dao/models/user.model.js");
const {createHash, isValidPassword}= require("../utils/hashBcrypt.js");

const LocalStrategy= local.Strategy;

const initializePassport= ()=>{
    passport.use("register", new LocalStrategy({
        passReqToCallback:true,
        usernameField: "email"
    }, async (req, username ,password,done)=>{
        const {first_name, last_name,email,age}= req.body;
        try {
            const userExist = await UserModel.findOne({email});
            if(userExist) return done (null,false);
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
              role: 'user',
            }

            const result = await UserModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }));

        passport.use("login", new LocalStrategy(
            {usernameField: "email"}, 
            async (email,password,done)=>{
            try {
                const userExist= await UserModel.findOne({email});
                if(!userExist) return done (null,false);
                if(!isValidPassword (password,userExist))return done(null,false);
                return done(null,userExist);
            } catch (error) {
               return done(error);
            }
        }))

        passport.serializeUser((user,done)=>{
            done(null,user._id);
        });

        passport.deserializeUser(async(id,done)=>{
            let user=await UserModel.findById({_id:id});
            done(null,user);
        })

}

module.exports= initializePassport;