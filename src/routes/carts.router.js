const express = require('express');
const router = express.Router();
const CartController = require("../dao/controllers/cart.controller.js");
const cartController = new CartController();

//Metodo POST - Crear Carrito Nuevo
router.post('/', cartController.createCart);
   
//Metodo GET - Lista los Productos que pertenecen a determinado carrito
router.get('/:cid', cartController.getCartById);

//Metodo POST - Agregar producto al Carrito seleccionado-
router.post('/:cid/product/:pid', cartController.addProductToCart);
  
//Metodo DELETE - Eliminamos del carrito un  producto por ID
router.delete("/:cid/product/:pid", cartController.deleteProductToCart);

//Metodo PUT -  Actualizamos productos del Carrito
router.put("/:cid",  cartController.updateCart);

//Metodo PUT - Actualizamos las Cantidedes de Producto
router.put("/:cid/product/:pid", cartController.updateQuantityProduct);
  
//Metodo DELETE - Vaciamos el Carrito
router.delete("/:cid", cartController.emptyCart);

// //GET - mostrar en /carts/:cid los productos que pertenecen a dicho carrito
router.get("/carts/:cid", cartController.cartCid);



module.exports = router;
