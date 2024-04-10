const UserModel = require("../models/user.model.js");

class UserService{
    async findByEmail(email){
        return UserModel.findOne({email});
    }
}
module.exports = UserService;