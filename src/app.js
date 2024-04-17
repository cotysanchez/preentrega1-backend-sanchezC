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
const authMiddleware = require('./middleware/authmiddleware.js');
const mockingRouter = require("./routes/mocking.router.js");
const errorHandler= require("./middleware/error.js");
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
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: parseInt(process.env.SESSION_TTL) || 90,
    }),
  })
);
app.use(errorHandler);

//Routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", mockingRouter);

//Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//AuthMiddleware
//app.use(authMiddleware);

//Listen PORT
const httpServer = app.listen(PORT, () => {
  console.log(
    `Servidor Express escuchando en el puerto http://localhost:${PORT}`
  );
});

//Websocket
const SocketManager = require("./sokets/soketmanager.js");
new SocketManager(httpServer);






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