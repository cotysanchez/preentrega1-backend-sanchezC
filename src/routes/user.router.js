const express = require ("express");
const router = express.Router();
const passport = require("passport");
//const generateToken = require("../utils/jsonwebtoken.js");
const UserController = require("../dao/controllers/user.controller.js");
const userController = new UserController();


router.post("/",passport.authenticate("register",{failureRedirect: "/failedregister"}), async (req,res)=>{
  if(!req.user) return res.status(400).send({status: "error", message: "Credenciales Invalidas"});
  res.redirect("/login");
})

router.post(
  '/',
  passport.authenticate('register', {
    failureRedirect: '/failedregister',
  }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: 'error', message: 'Credenciales invalidas' });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart,
    };

    req.session.login = true;

    res.redirect('/profile');
  }
);


router.get("failedregister", (req,res)=>{
  res.json({message: "Registro Fallido"})
});

module.exports = router;