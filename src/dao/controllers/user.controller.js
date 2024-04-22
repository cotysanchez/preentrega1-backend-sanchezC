const UserModel = require('../models/user.model.js');
const CartModel = require('../models/cart.model.js');
const jwt = require('jsonwebtoken');
const { createHash, isValidPassword } = require('../../utils/hashBcrypt.js');
const UserDTO = require('../../dto/user.dto.js');

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existUser = await UserModel.findOne({ email });
      if (existUser) {
        return res.status(400).send('El usuario ya existe');
      }

      //Creo un nuevo carrito:
      const newCart = new CartModel();
      await newCart.save();

      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        cart: newCart._id,
        password: createHash(password),
        age,
      });

      await newUser.save();

      const token = jwt.sign({ user: newUser }, 'coderhouse', {
        expiresIn: '5h',
      });

      res.cookie('coderCookieToken', token, {
        maxAge: 36000000,
        httpOnly: true,
      });

      res.redirect('/api/users/profile');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).send('Usuario no válido');
      }

      const isValid = isValidPassword(password, user);
      if (!isValid) {
        return res.status(401).send('Contraseña incorrecta');
      }

      const token = jwt.sign({ user: user }, 'coderhouse', {
        expiresIn: '5h',
      });

      res.cookie('coderCookieToken', token, {
        maxAge: 36000000,
        httpOnly: true,
      });

      res.redirect('/api/users/profile');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  }

  async profile(req, res) {
    const userDto = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role
    );
    const isAdmin = req.user.role === 'admin';
    res.render('profile', { user: userDto, isAdmin });
  }

  async logout(req, res) {
    res.clearCookie('coderCookieToken');
    res.redirect('/login');
  }

  async admin(req, res) {
    if (req.user.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado');
    }
    res.render('admin');
  }
}

module.exports = UserController;
