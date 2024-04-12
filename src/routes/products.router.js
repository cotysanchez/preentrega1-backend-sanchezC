const express = require('express');
const router = express.Router();
const ProductController = require("../dao/controllers/product.controller.js");
const productController = new ProductController();


//Obtener todos los prodcutos
router.get('/', productController.getProducts);
  
//Obtener un producto por ID
router.get('/:pid', productController.getProductById);
  
//Agregar un Nuevo Producto
router.post('/', productController.addProduct);

//Actualizar un producto por ID
router.put('/:pid', productController.updateProduct);

//Eliminar un producto por ID
router.delete('/:pid', productController.deleteProduct);


module.exports = router;
