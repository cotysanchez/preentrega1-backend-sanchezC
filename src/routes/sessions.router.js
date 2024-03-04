const express = require("express");
const router = express.Router();
const UserModel= require ("../dao/models/user.model.js");
const {isValidPassword} = require("../utils/hashBcrypt.js");
const passport =require ("passport");

//POST - Login con Passport
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    
    req.session.user = {
      first_name: 'Admin',
      last_name: 'Admin',
      email: email,
      role: 'admin',
    };
    
    req.session.login = true;
    return res.redirect('/products'); 
  } else {
    
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Usuario no encontrado' });
    }

    const isValid = await isValidPassword(password, user);
    if (!isValid) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Credenciales Inválidas' });
    }

    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
    req.session.login = true;
    return res.redirect('/products'); 
  }
});


// GET - Para GitHub : 
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})
router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    //La estrategía de github nos retornará el usuario, entonces lo agregamos a nuestro objeto de session. 
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/products");
})

/*Version con JWT */

//GET - Logout 
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