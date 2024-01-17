const express = require('express');
const app = express();
const PORT = 8080;
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const path = require('path');
const exphbs = require("express-handlebars");
const viewsRouter= require("./routes/views.router.js");
const homeRouter= require("./routes/views.router.js");
const socket = require("socket.io");
const ProductManager = require('./controllers/product-manager.js');
const productManager = new ProductManager('./src/models/productos.json');



//Le decimos a express que cuando vea un archivo"handlebars" utilice motor de plantillas: "handlebars"
app.engine("handlebars",exphbs.engine());
//le decimos q la vista de nustra app es desarrollada con Handlebars
app.set("view engine", "handlebars");
//le decimos a express donde tiene que ir a buscar los archivos Handlebars (a vistas)
app.set("views", "src/views");


//Middleware
app.use(express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use("/", viewsRouter);
app.use('/realtimeproducts', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//Le decimos a express que cuando vea un archivo"handlebars" utilice motor de plantillas: "handlebars"
app.engine("handlebars",exphbs.engine());
//le decimos q la vista de nustra app es desarrollada con Handlebars
app.set("view engine", "handlebars");
//le decimos a express donde tiene que ir a buscar los archivos Handlebars (a vistas)
app.set("views", "src/views");




const httpServer = app.listen(PORT,()=>{
  console.log(
    `Servidor Express escuchando en el puerto http://localhost:${PORT}`
  );
})
const io =socket(httpServer);

//configuramos el evento:  "connection"
io.on("connection", async (socket) =>{
  console.log ("Cliente Conectado");
 
  socket.emit("products", await productManager.getProducts());

  socket.on("eliminarProducto", async (id)=>{
    await productManager.deleteProduct(id);
    io.sockets.emit("products", await productManager.getProducts());
  });

  // ojo ver si es product o producto??????
  socket.on("agregarProducto", async (product)=>{
    await productManager.addProduct(product);
    io.sockets.emit("products",await productManager.getProducts())
  });

});









