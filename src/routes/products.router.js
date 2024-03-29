const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/db/product-manager-db.js');
const productManager = new ProductManager();

const mongoose = require('mongoose');

// Metodo GET - Obtener todos los prodcutos
router.get('/', async (req, res) => {
  
  try {
    const {limit = 10, page = 1 , sort, query} =req.query;

    const products = await productManager.getProducts({
      limit:parseInt(limit),
      page:parseInt(page),
      sort,
      query,
    });
    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
        : null,
    });
    
  } catch (error) {
    console.log('Error al obtener productos:', error);
    res.status(500).json({ status: "error", error: 'Error interno del servidor' });
  }
});


//Metodo GET - Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json( product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado!' });
    }
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


//Metodo POST - Agregar un Nuevo Producto
router.post('/', async (req, res) => {
  const newProduct = req.body;
  try {
    
    await productManager.addProduct(newProduct);
    res.status(201).json({ message: 'Producto agregado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
});

//Metodo PUT - Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const productUpdate = req.body;

  try {
    await productManager.updateProduct(productId, productUpdate);
    res.json({ message: 'Producto Actualizado Exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});

//Metodo DELETE - Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
   const productId = req.params.pid;

  try {
    await productManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});


module.exports = router;
