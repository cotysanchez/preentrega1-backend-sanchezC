const express = require('express');
const router = express.Router();
const CartManager = require('../dao/db/cart-manager-db.js');
const cartManager = new CartManager();
const CartModel= require("../dao/models/cart.model.js");

//Metodo POST - Crear Carrito Nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error('Error al crear un Nuevo Carrito', error);
    res.status(500).json({ error: 'Error Interno del Servidor' });
  }
});

//Metodo GET - Lista los Productos que pertenecen a determinado carrito
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await CartModel.findById(cartId);

    if(!cart){
      console.log("No existe el Carrito con ese ID");
      return res.status(404).json({error: "Carrito no encontrado"});
    }

    return res.json(cart.products);

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


//Metodo DELETE - Eliminamos del carrito un  producto por ID
router.delete("/:cid/product/:pid", async (req,res)=>{
  try {
    const cartId= req.params.cid;
    const productId= req.params.pid;
    const updatedCart= await cartManager.deleteProductToCart(cartId,productId);

    res.json({
      status: "success",
      message: "Producto eliminado del Carrito Exitosamente", updatedCart,
    });


  } catch (error) {
    console.error('Error al eliminar el producto del carrito', error);
    res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor',
    });
  }

});


//Metodo PUT -  Actualizamos productos del Carrito
router.put("/:cid", async (req, res)=>{
  const cartId= req.params.cid;
  const updatedProducts= req.body;

  try {
    const updatedCart= await cartManager.updateCart(cartId, updatedProducts);
    res.json (updatedCart);

  } catch (error) {
    console.error("Error al acutualizar el Carrito", error);
    res.status(500).json({
      status: "error", error: "Error Interno del Servidor",
    });
  }

});

//Metodo PUT - Actualizamos las Cantidedes de Producto
router.put("/:cid/product/:pid", async (req,res)=>{
  try {
    const cartId= req.params.cid;
    const productId= req.params.pid;
    const newQuantity= parseInt(req.body.quantity);

    const updatedCart= await cartManager.updateQuantityProduct(cartId, productId, newQuantity);
    res.json({
      status:"success", message:"Cantidad del producto actualizada exitosamente",
      updatedCart
    });

  } catch (error) {
    console.error("Error al actualizar la cantidad del prducto en el Carrito", error);
    res.status(500).json({
      status: "error", error: "Error Interno del Servidor",
    });
  }
},

//Metodo DELETE - Vaciamos el Carrito
router.delete("/:cid", async (req,res)=>{
  try {
    const cartId = req.params.cid;
    const updatedCart= await cartManager.emptyCart(cartId);
    res.json({status: "success", message: "Todod los productos del carrito fueron eliminados exitosamente",updatedCart,});
  } catch (error) {
      console.error('Error al vaciar el carrito', error);
      res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor'
    });
  }
  }));

module.exports = router;
