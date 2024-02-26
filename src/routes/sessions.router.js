const express = require("express");
const router = express.Router();
const UserModel= require ("../dao/models/user.model.js");
const {isValidPassword} = require("../utils/hashBcrypt.js");
const passport =require ("passport");


//Login - POST
router.post("/login", passport.authenticate( "login", {failureRedirect:"api/sessions/faillogin"}), async (req,res)=>{
    if (!req.user) return res.status(400).send ({status: "error", message:"Credenciales Invalidas"});
    if (req.user.email=== "adminCoder@coder.com"){
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: "admin"
        };

    }else{
        req.session.user = {
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          email: req.user.email,
          age: req.user.age,
          role: req.user.role
        };
    }
    req.session.login=true;
    res.redirect("/products");
   
   
});

//Logout - GET
router.get("/logout", (req,res)=>{
    try {
        if(req.session.login){
        req.session.destroy();
    }
    res.redirect("/login");
    }catch (error) {
        res.status(500).json ({message: error});
    }
});
    
router.get("faillogin", async (req,res)=>{
    res.json({message: "fallo la estartegia"});
});


module.exports = router;