const express = require('express');
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();

//GET - Mostrar Todos los Productos en "/home"
router.get('/home', async (req, res) => {
  try {
    const productos = await productManager.getProducts();
    res.render('home', { products: productos });
  } catch (error) {
    console.log('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//GET - Mostrar productos en tiempo real en "/realtimeproducts"
router.get('/realtimeproducts', async (req, res) => {
  try {
    res.render('realtimeproducts', { titulo: 'productos en tiempo real' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//GET - Mostrar Chat en "/chat"
router.get("/chat", async (req,res)=>{
  res.render("chat");
})


//GET - mostrar productos en /products 
router.get('/products', async (req, res) => {
  try {
    const {page = 1, limit= 10} = req.query;
    const products = await productManager.getProducts({
      page:parseInt(page),
      limit: parseInt(limit)
    });

    if (!products.docs) {
      console.log(
        'Error: No se encontraron documentos en los productos obtenidos'
      );
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const newArray = products.docs.map(product =>{
      const {_id, ...rest} = product.toObject();
      return rest;
    })

    res.render('products', { 
      products: newArray, 
      hasPrevPage: products.hasPrevPage, 
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages,
       });

  } catch (error) {
    console.log('Error al obtener productos:', error);
    res.status(500).json({ status: "error", 
    error: 'Error interno del servidor' });
  }
});

//GET - mostrar en /carts/:cid los productos que pertenecen a dicho carrito
router.get("/carts/:cid", async (req,res)=>{
  const cartId= req.params.cid;
  try {
    const cart = await cartManager.getCartById(cartId);

    if(!cart){
      console.log(" No existe el carrito con este ID");
      return res.status(404).json({error: "Carrito no encontrado"})
    }

    const productsInCart= cart.products.map(item =>({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));
    res .render("carts",{products: productsInCart});


  } catch (error) {
    console.error("Error al obtener el Carrito", error);
    res.status(500).json ({error: "Error interno del Servidor"});
  }

});



module.exports = router;
