const express = require('express');
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.get("/chat", async (req,res)=>{
  res.render("chat");
})

module.exports = router;
