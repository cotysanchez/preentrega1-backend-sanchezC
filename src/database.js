//Connect Mongo DB
const mongoose = require('mongoose');
const configObject = require('./config/config.js');
const { mongo_url } = configObject;

//Mongoose connect
mongoose
  .connect(mongo_url)
  .then(() => console.log('Conectados a la Base de Datos'))
  .catch((error) => console.log(error));
