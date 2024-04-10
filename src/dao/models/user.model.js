const mongoose = require('mongoose');

//Creamos el esquema del Usuario
const userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,

    email: {
    type: String,
    unique: true,
    },
    
    password: String,
    age:  Number,

    cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"carts"},
      
    role: {
    type: String,
    enum: ["admin","user"],
    default: "user"
    }
});

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;
