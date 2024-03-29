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
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store");
const fileStore = FileStore(session);
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const passport = require("passport");
const initializePassport= require("./config/passport.config.js");



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
app.use(cookieParser());
app.use(
  session({
    secret: 'secretCoder',
    resave: true,
    saveUninitilazed: true,
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://cotys21:coder1@cluster0.wv9khgm.mongodb.net/Ecommerce?retryWrites=true&w=majority', ttl:190
    }),
  })
);

//Routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

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

//Login
app.get("/login", (req,res)=>{
  let user = req.query.user;

  req.session.user = user;
  res.send("Guardamos el User por medio de Query");
});

//Usuario
app.get ("/user",(req,res)=>{
  if(req.session.user){
    return res.send(`El usuario registrado es: ${req.session.user}`);
  }
  res.send("No tenemos un usuario registrado");
});