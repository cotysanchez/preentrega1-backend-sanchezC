const mongoose= require("mongoose");

const productSchema = new mongoose.Schema({
    title: {type:String,
        required:true},

    description:{type:String,
    required: true},

    price:{type: Number,
    required: true },

    thumbnail: {type: [String]},

    code: {type:String,
    required:true,
    unique: true},

    stock: {type:Number,
    required:true},

    category: {type:String,
    required: false}, //aca era true

    status: {type:Boolean,
    required: false} //aca era true
});

const ProductModel= mongoose.model("Product", productSchema);

module.exports= ProductModel;