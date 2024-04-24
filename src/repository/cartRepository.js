const CartModel = require('../dao/models/cart.model.js');

class CartRepository {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      req.logger.info('Error al crear el Carrito de Compras');
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        req.logger.info('No existe el Carrito con ese ID');
        return null;
      }
      return cart;
    } catch (error) {
      req.logger.info('Error al traer el Carrito', error);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);

      if (!cart) {
        throw new Error('El carrito no se encontro!!');
      }

      const existProduct = cart.products.find(
        (item) => item.product._id.toString() === productId
      );

      if (existProduct) {
        existProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified('products');

      await cart.save();
      return cart;
    } catch (error) {
      req.logger.info('Error al agregar un prodcuto al carrito', error);
    }
  }

  async deleteProductToCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      req.logger.info(cartId);
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );

      await cart.save();

      return cart;
    } catch (error) {
      req.logger.error(
        'Error al eliminar el producto del carrito en el gestor',
        error
      );
      throw error;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = updatedProducts;
      cart.markModified('products');
      await cart.save();
      return cart;
    } catch (error) {
      req.logger.error('Error al actualizar el carrito', error);
      throw error;
    }
  }

  async updateQuantityProduct(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        req.logger.info(cart.products[productIndex].quantity);

        cart.markModified('products');
        await cart.save();
        return cart;
      } else {
        throw new Error('Producto no encontrado en el Carrito');
      }
    } catch (error) {
      req.logger.error(
        'Error al actualizar la cantidad del producto en el Carrito',
        error
      );
    }

    throw error;
  }

  async emptyCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart;
    } catch (error) {
      req.logger.error('Error al vaciar el carrito en el gestor', error);
      throw error;
    }
  }
}

module.exports = CartRepository;
