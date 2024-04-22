const express = require('express');
const router = express.Router();
const passport = require('passport');
const generateToken = require('../utils/jsonwebtoken.js');
const SessionsController = require('../dao/controllers/sessions.controller.js');
const sessionsController = new SessionsController();

//Login con Passport
router.post('/login', sessionsController.login);
//Current
router.get('/current', sessionsController.current);
//Logout
router.get('/logout', sessionsController.logout);
// Faillogin
router.get('/faillogin', sessionsController.faillogin);

// GET - Para GitHub :
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
);
router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    //La estrategía de github nos retornará el usuario, entonces lo agregamos a nuestro objeto de session.
    req.session.user = req.user;
    req.session.login = true;
    res.redirect('/products');
  }
);

//POST - Login con JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await UserModel.findOne({ email: email });

    if (!usuario) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Y ese usuario de donde salio?' });
    }

    if (!isValidPassword(password, usuario)) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Credenciales invalidas' });
    }

    //Si la contraseña es correcta, generamos el token.
    const token = generateToken({
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      email: usuario.email,
      id: usuario._id,
    });

    res.send({ status: 'success', token });
  } catch (error) {
    console.log('Error en al autenticación', error);
    res
      .status(500)
      .send({ status: 'error', message: 'Error interno del servidor' });
  }
});

module.exports = router;
