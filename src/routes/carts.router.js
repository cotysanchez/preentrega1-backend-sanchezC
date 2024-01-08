const express = require('express');
const router = express.Router();
const CartManager = require('../controllers/cart-manager.js');
const cartManager = new CartManager('./src/models/carrito.json');

//Metodo POST - Crear Carrito
router.post('/', async (req, res) => {
  try {
    const nuevoCarrito = cartManager.crearCarrito();
    res.json(nuevoCarrito);
  } catch (error) {
    console.error('Error al crear un Nuevo Carrito', error);
    res.status(500).json({ error: 'Error Interno del Servidor' });
  }
});

//Metodo GET - Listado de Productos que pertenecen a carrito
router.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);

  try {
    const carrito = await cartManager.getCarritoById(cartId);
    res.json(carrito.products);
  } catch (error) {
    console.error('Error al obtener el Carrito', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//Metodo POST - Agregar productos a distintos Carritos
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const actualizarCarrito = await cartManager.agregarProductoAlCarrito(
      cartId,
      productId,
      quantity
    );
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error('Error  al agregar producto al Carrito', error);
    res.status(500).json({ error: 'Error interno del Servidor' });
  }
});

module.exports = router;
