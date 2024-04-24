//const CartModel = require('../models/cart.model.js');
const CartRepository = require('../../repository/cartRepository.js');
const cartRepository = new CartRepository();
const TicketModel = require('../models/ticket.model.js');
const UserModel = require('../models/user.model.js');
const ProductRepository = require('../../repository/productRepository.js');
const productRepository = new ProductRepository();
const {
  generateUniqueCode,
  calcularTotal,
} = require('../../utils/cartutils.js');

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartRepository.createCart();
      res.json(newCart);
    } catch (error) {
      req.logger.error('Error al crear un Nuevo Carrito', error);
      res.status(500).json({ error: 'Error Interno del Servidor' });
    }
  }

  async getCartById(req, res) {
    const cartId = req.params.cid;

    try {
      const cart = await cartRepository.findById(cartId);
      if (!cart) {
        req.logger.info('No existe el Carrito con ese ID');
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      return res.json(cart.products);
    } catch (error) {
      req.logger.error('Error al obtener el Carrito', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      const updateCart = await cartRepository.addProductToCart(
        req,
        cartId,
        productId,
        quantity
      );
      res.json(updateCart.products);
    } catch (error) {
      req.logger.error('Error  al agregar producto al Carrito', error);
      res.status(500).json({ error: 'Error del Servidor' });
    }
  }

  async deleteProductToCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const updatedCart = await cartRepository.deleteProductToCart(
        req,
        cartId,
        productId
      );

      res.json({
        status: 'success',
        message: 'Producto eliminado del Carrito Exitosamente',
        updatedCart,
      });
    } catch (error) {
      req.logger.error('Error al eliminar el producto del carrito', error);
      res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor',
      });
    }
  }

  async updateCart(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
      const updatedCart = await cartRepository.updateCart(
        cartId,
        updatedProducts
      );
      res.json(updatedCart);
    } catch (error) {
      req.logger.error('Error al acutualizar el Carrito', error);
      res.status(500).json({
        status: 'error',
        error: 'Error Interno del Servidor',
      });
    }
  }

  async updateQuantityProduct(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const newQuantity = parseInt(req.body.quantity);

      const updatedCart = await cartRepository.updateQuantityProduct(
        req,
        cartId,
        productId,
        newQuantity
      );
      res.json({
        status: 'success',
        message: 'Cantidad del producto actualizada exitosamente',
        updatedCart,
      });
    } catch (error) {
      req.logger.error(
        'Error al actualizar la cantidad del prducto en el Carrito',
        error
      );
      res.status(500).json({
        status: 'error',
        error: 'Error Interno del Servidor',
      });
    }
  }

  async emptyCart(req, res) {
    try {
      const cartId = req.params.cid;
      const updatedCart = await cartRepository.emptyCart(cartId);
      res.json({
        status: 'success',
        message:
          'Todod los productos del carrito fueron eliminados exitosamente',
        updatedCart,
      });
    } catch (error) {
      req.logger.error('Error al vaciar el carrito', error);
      res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor',
      });
    }
  }

  //GET - mostrar en /carts/:cid los productos que pertenecen a dicho carrito
  async cartCid(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCartById(cartId);

      if (!cart) {
        req.logger.info(' No existe el carrito con este ID');
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const productsInCart = cart.products.map((item) => ({
        product: item.product.toObject(),
        quantity: item.quantity,
      }));
      res.render('carts', { products: productsInCart });
    } catch (error) {
      req.logger.error('Error al obtener el Carrito', error);
      res.status(500).json({ error: 'Error interno del Servidor' });
    }
  }

  async finishPurchase(req, res) {
    const cartId = req.params.cid;
    try {
      // Obtener el carrito y sus productos
      const cart = await cartRepository.getCartById(cartId); //getProductToCart
      const products = cart.products;

      // Inicializar un arreglo para almacenar los productos no disponibles
      const productsNotAvailable = [];

      // Verificar el stock y actualizar los productos disponibles
      for (const item of products) {
        const productId = item.product;
        const product = await productRepository.getProductById(productId);
        if (product.stock >= item.quantity) {
          // Si hay suficiente stock, restar la cantidad del producto
          product.stock -= item.quantity;
          await product.save();
        } else {
          // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
          productsNotAvailable.push(productId);
        }
      }

      const userWithCart = await UserModel.findOne({ cart: cartId });

      // Crear un ticket con los datos de la compra
      const ticket = new TicketModel({
        code: generateUniqueCode(),
        purchase_datetime: new Date(),
        amount: calcularTotal(cart.products),
        purchaser: userWithCart._id,
      });
      await ticket.save();

      // Eliminar del carrito los productos que sí se compraron
      cart.products = cart.products.filter((item) =>
        productsNotAvailable.some((productId) => productId.equals(item.product))
      );

      // Guardar el carrito actualizado en la base de datos
      await cart.save();

      res.status(200).json({ cartId: cart._id, ticketId: ticket._id }); // aca iba productsNotAvailable;
    } catch (error) {
      req.logger.error('Error al procesar la compra:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}
module.exports = CartController;
