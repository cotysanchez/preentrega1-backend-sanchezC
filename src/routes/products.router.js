const express = require('express');
const router = express.Router();
const ProductController = require("../dao/controllers/product.controller.js");
const productController = new ProductController();




// Metodo GET - Obtener todos los prodcutos
router.get('/', productController.getProducts);
  
//Metodo GET - Obtener un producto por ID
router.get('/:pid', productController.getProductById);
  
//Metodo POST - Agregar un Nuevo Producto
router.post('/', productController.addProduct);

//Metodo PUT - Actualizar un producto por ID
router.put('/:pid', productController.updateProduct);

//Metodo DELETE - Eliminar un producto por ID
router.delete('/:pid', productController.deleteProduct);


module.exports = router;
