const express = require('express');
const router = express.Router();
const CartManager = require('../dao/db/cart-manager-db.js');
const cartManager = new CartManager();

//Metodo POST - Crear Carrito Nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error('Error al crear un Nuevo Carrito', error);
    res.status(500).json({ error: 'Error Interno del Servidor' });
  }
});

//Metodo GET - Lista los Productos que pertenecen a carrito
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    console.error('Error al obtener el Carrito', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//Metodo POST - Agregar producto al Carrito seleccionado- E incremento de Quantity
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const updateCart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(updateCart.products);
  } catch (error) {
    console.error('Error  al agregar producto al Carrito', error);
    res.status(500).json({ error: 'Error del Servidor' });
  }
});

module.exports = router;
