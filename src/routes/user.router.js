const express = require ("express");
const router = express.Router();
const UserModel= require ("../dao/models/user.model.js");
const {createHash} = require("../utils/hashBcrypt.js");
const passport = require("passport");
const generateToken = require("../utils/jsonwebtoken.js");


/*
router.post("/", async(req,res)=>{
    const {first_name, last_name,email, password, age} = req.body;
    
  try{
   const existUser = await UserModel.findOne({first_name,last_name,email,password,age});
   if (existUser){
    return res.status(400).send({error: "El correo electrónico ya esta registrado"})
   }
   
   const newUser = await UserModel.create({
     first_name,
     last_name,
     email,
     password: createHash(password),
     age,
   });

   //req.session.login =true,
   //req.session.user= {...newUser._doc};

   //res.status(200).send({message : "Usuario Creado Exitosamente"});
   res.redirect("/login");

  }catch (error){
    console.error("Error al crear usuario:", error);
    res.status(500).send({error: "Error al Crear Usuario"});

  }
});
*/

router.post("/",passport.authenticate("register",{failureRedirect: "/failedregister"}), async (req,res)=>{
  if(!req.user) return res.status(400).send({status: "error", message: "Credenciales Invalidas"});
  res.redirect("/login");
})

router.get("failedregister", (req,res)=>{
  res.json({message: "Registro Fallido"})
});

module.exports = router;