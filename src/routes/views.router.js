const express = require('express');
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();
const ProductModel = require("../dao/models/product.model.js");

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

//GET - Mostrar productos en tiemp real en "/realtimeproducts"
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

/*
//GET - mostrar productos en /products
router.get('/products', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('products', { products: products });
  } catch (error) {
    console.log('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


//GET - Obtener los productos en /products
router.get('/products', async (req, res) => {
  try {
    const products = await ProductModel.find().lean();
    res.render('products', { products: products });
    
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar' });
  }
});


//POST - en /products
router.post('/', async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.send({
      resultado: 'Producto agregado exitosamente',
      product: product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar ,error' });
  }
});

*/


module.exports = router;
