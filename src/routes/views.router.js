const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/product-manager.js');
const productManager = new ProductManager('./src/models/productos.json');


router.get('/home', async (req, res) => {
  try {
    
    const productos = await productManager.getProducts();
    res.render('home', { products: productos });
    
  } catch (error) {
    console.log('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.get('/realtimeproducts', async (req, res) => {
  try {
    res.render('realtimeproducts', { titulo: 'productos en tiempo real' });
  } catch (error) {
    res.status(500).json({error: "Error interno del servidor"}); 
  }
});


module.exports = router;