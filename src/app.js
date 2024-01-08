const express = require('express');
const app = express();
const PORT = 8080;
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const path = require('path');

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//Listen
app.listen(PORT, () => {
  console.log(
    `Servidor Express escuchando en el puerto http://localhost:${PORT}`
  );
});
