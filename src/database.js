//Connect Mongo DB
const mongoose =require ("mongoose");

//Mongoose connect
mongoose.connect("mongodb+srv://cotys21:coder1@cluster0.wv9khgm.mongodb.net/Ecommerce?retryWrites=true&w=majority")
  .then(()=> console.log("Conectados a la Base de Datos"))
  .catch((error)=> console.log(error))