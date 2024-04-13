const express = require('express');
const router = express.Router();
const CartController = require("../dao/controllers/cart.controller.js");
const cartController = new CartController();
const passport =require ("passport");

//Crear Carrito Nuevo
router.post('/', cartController.createCart);   
//Lista los Productos que pertenecen a determinado carrito
router.get('/:cid', cartController.getCartById);
//Agregar producto al Carrito seleccionado-
router.post('/:cid/product/:pid', cartController.addProductToCart);  
//Eliminamos del carrito un  producto por ID
router.delete("/:cid/product/:pid", cartController.deleteProductToCart);
//Actualizamos productos del Carrito
router.put("/:cid",  cartController.updateCart);
//Actualizamos las Cantidedes de Producto
router.put("/:cid/product/:pid", cartController.updateQuantityProduct); 
//Vaciamos el Carrito
router.delete("/:cid", cartController.emptyCart);
//mostrar en /carts/:cid los productos que pertenecen a dicho carrito
router.get("/carts/:cid", cartController.cartCid);
//Finalizar Compra
router.post("/:cid/purchase", passport.authenticate("jwt",{session: false}), cartController.finishPurchase);


module.exports = router;
