const CartModel = require('../models/cart.model.js');
const ProductModel = require('../models/product.model.js');
const ProductRepository = require('../../repository/productRepository.js');
const productRepository = new ProductRepository();
const CartRepository = require('../../repository/cartRepository.js');
const cartRepository = new CartRepository();
const TicketRepository = require('../../repository/ticketRepository.js');
const ticketRepository = new TicketRepository();
const UserModel = require('../models/user.model.js');

class ViewsController {
  async renderProducts(req, res) {
    try {
      const { page = 1, limit = 3 } = req.query;
      const skip = (page - 1) * limit;
      const products = await ProductModel.find().skip(skip).limit(limit);
      const totalProducts = await ProductModel.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const newArray = products.map((product) => {
        const { _id, ...rest } = product.toObject();
        return { id: _id, ...rest };
      });

      const cartId = req.user.cart.toString();
      //req.logger.info(cartId);

      res.render('products', {
        products: newArray,
        hasPrevPage,
        hasNextPage,
        prevPage: page > 1 ? parseInt(page) - 1 : null,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        currentPage: parseInt(page),
        totalPages,
        cartId,
      });
    } catch (error) {
      req.logger.error('Error al obtener productos', error);
      res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor',
      });
    }
  }

  async renderCart(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCartById(cartId);

      if (!cart) {
        req.logger.info('No existe ese carrito con el id');
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      let totalBuy = 0;

      const productsInCart = cart.products.map((item) => {
        const product = item.product.toObject();
        const quantity = item.quantity;
        const totalPrice = (product ? product.price : 0) * quantity;

        totalBuy += totalPrice;

        return {
          product: { ...product, totalPrice },
          quantity,
          cartId,
        };
      });

      res.render('carts', { products: productsInCart, totalBuy, cartId });
    } catch (error) {
      req.logger.error('Error al obtener el carrito', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getProducts(req, res) {
    try {
      if (!req.session.login) {
        return res.redirect('/login');
      } else {
        const productos = await productRepository.getProducts();
        res.render('login', { products: productos });
      }
    } catch (error) {
      req.logger.info('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  //GET - Mostrar productos en tiempo real en "/realtimeproducts"
  async realTimeProducts(req, res) {
    try {
      res.render('realtimeproducts', { titulo: 'productos en tiempo real' });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  //GET - Mostrar Chat en "/chat"
  async chat(req, res) {
    res.render('chat');
  }

  //GET - mostrar productos en /products
  async Products(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const products = await productRepository.getProducts({
        page: parseInt(page),
        limit: parseInt(limit),
      });

      if (!products.docs) {
        req.logger.info(
          'Error: No se encontraron documentos en los productos obtenidos'
        );
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      const cart = req.session.user.cart ? req.session.user.cart : false;

      const newArray = products.docs.map((product) => {
        const { _id, ...rest } = product.toObject();
        return { ...rest, cart: cart, _id: _id + '' };
      });

      let cartunico;
      if (cart) {
        cartunico = await CartModel.findOne({ _id: req.session.user.cart });
      }

      res.render('products', {
        products: newArray,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        currentPage: products.page,
        totalPages: products.totalPages,
        user: req.session.user,
        cartLength: cart ? cartunico.products.length : false,
      });
    } catch (error) {
      req.logger.info('Error al obtener productos:', error);
      res
        .status(500)
        .json({ status: 'error', error: 'Error interno del servidor' });
    }
  }
  async renderPurchase(req, res) {
    try {
      req.logger.info('*** RENDER PURCHASE');
      req.logger.info('** req.params.cid:' + req.params.cid);
      req.logger.info('** req.params.tid:' + req.params.tid);
      const cart = await cartRepository.getCartById(req.params.cid);
      const ticket = await ticketRepository.getTicketById(req.params.tid);
      const purchaser = await UserModel.findById(ticket.purchaser);
      const products = cart.products;
      const cartInfo = ' Pendientes de compra. Sin stock por el momento';
      const title = 'Compra Finalizada';
      const hasTicket = true;

      if (!req.params.tid) {
        throw new Error('El ID del ticket no está definido');
      }

      res.render('carts', {
        products,
        cart,
        ticket,
        title,
        cartInfo,
        purchaser,
        hasTicket,
      });
    } catch (error) {
      req.logger.error('Error al renderizar finalizar compra:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  //Login
  async login(req, res) {
    if (req.session.login) {
      return res.redirect('/products');
    }
    res.render('login');
  }

  // Registro
  async register(req, res) {
    if (req.session.login) {
      return res.redirect('/profile');
    }
    res.render('register');
  }

  //Perfil
  async profile(req, res) {
    if (!req.session.login) {
      return res.redirect('/login');
    }
    res.render('profile', { user: req.session.user });
  }
}

module.exports = ViewsController;
