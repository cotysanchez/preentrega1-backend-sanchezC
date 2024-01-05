const express = require('express');
const ProductManager = require('./controllers/product-manager.js');

const app = express();
const PORT = 8080;

//Creamos instancia de la Clase Product Manager
const manager = new ProductManager('./src/productos.json');

// Obtener productos con límite
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await manager.getProductsLimit(limit);
    res.json({ products: productos });
  } catch (error) {
    console.log('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const producto = await manager.getProductById(productId);
    if (producto) {
      res.json({ product: producto });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(
    `Servidor Express escuchando en el puerto http://localhost:${PORT}/products`
  );
});
