const express = require('express');
const app = express();
const PORT = 8080;
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const path = require('path');
const exphbs = require('express-handlebars');
const viewsRouter = require('./routes/views.router.js');
const socket = require('socket.io');
const MessageModel = require('./dao/models/message.model.js');
require('./database.js');

// Handlebars
const hbs = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

// Motores de Plantilla - vistas
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
io.on("connection", (socket) =>{
  console.log('Nuevo usuario Conectado');

  //Guardamos el Msj en Mongo DB
  socket.on('message', async data => {
    await MessageModel.create(data);

    //Obtengo los msj Mongo DB y se los paso al cliente:
    const messages = await MessageModel.find();
    console.log(messages);
    io.sockets.emit("message",messages);
  });

});

