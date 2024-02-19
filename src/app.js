const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');
const exphbs = require('express-handlebars');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const socket = require('socket.io');
const MessageModel = require('./dao/models/message.model.js');
const ProductManager = require("./dao/db/product-manager-db.js");
const productManager = new ProductManager("./src/models/product.model.js");

require('./database.js');

// Handlebars
const hbs = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

// Motores de Plantilla Handlebars - vistas
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

//Middleware
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//Listen PORT
const httpServer = app.listen(PORT, () => {
  console.log(
    `Servidor Express escuchando en el puerto http://localhost:${PORT}`
  );
});

const io = new socket.Server(httpServer);

//configuramos el evento:  "connection"
io.on("connection", async (socket) =>{
  console.log('Nuevo usuario Conectado');


socket.emit('products', await productManager.getProducts());

  socket.on('deleteProduct', async (id) => {
    try {
      await productManager.deleteProduct(id);
      io.sockets.emit('products', await productManager.getProducts());
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
    
  });

  socket.on('addProduct', async (product) => {
    await productManager.addProduct(product);
    io.sockets.emit('products', await productManager.getProducts());
  });

  //Guardamos el Msj en Mongo DB
  socket.on('message', async data => {
    await MessageModel.create(data);

    //Obtengo los msj Mongo DB y se los paso al cliente:
    const messages = await MessageModel.find();
    console.log(messages);
    io.sockets.emit("message",messages);
  });

});

