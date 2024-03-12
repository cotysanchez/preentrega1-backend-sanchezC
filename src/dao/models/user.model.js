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

    role: {
    type: String,
    default: "user"
    }
});

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;
