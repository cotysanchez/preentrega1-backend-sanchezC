const UserModel = require("../models/user.model.js");
const {isValidPassword} = require("../../utils/hashBcrypt.js");



class SessionsController {
  async login(req, res) {
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
  }

  async current (req, res) {
    if (req.session && req.session.user) {
      res.json(req.session.user);
    } else {
      res
        .status(401)
        .json({ status: 'error', message: 'No esta logueado el Usuario' });
    }
  }

  async logout(req, res) {
    try {
      if (req.session.login) {
        req.session.destroy();
      }
      res.redirect('/login');
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async faillogin(req, res) {
    res.json({ message: 'fallo la estartegia' });
  }

}


module.exports = SessionsController;
