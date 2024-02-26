//Para hashear password
const bcrypt = require("bcrypt");
//generarar un salt de 10 caracteres 
const createHash = password=> bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Validar un Password
const isValidPassword = (password, user)=> bcrypt.compareSync(password,user.password);

module.exports = {
    createHash,
    isValidPassword
};