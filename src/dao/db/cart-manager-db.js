const CartModel = require("../models/cart.model.js");

class CartManager{
    async createCart(){
        try{
            const newCart= new CartModel({products:[]});
            await newCart.save();
            return newCart;
        }catch(error){
            console.log("Error al crear el Carrito de Compras");
        }
    }

    async getCartById(cartId){
        try{
            const cart = await CartModel.findById(cartId);
                if(!cart){
                    console.log("No existe el Carrito con ese ID") 
                    return null;
                }
            return cart;

        }catch (error) {
            console.log("Error al traer el Carrito", error);
        }
    }


    async addProductToCart(cartId, productId, quantity=1){
        try {
            const cart = await this.getCartById(cartId);
            const existProduct= cart.products.find(item => item.product.toString() === productId);

            if(existProduct){
                existProduct.quantity += quantity;
            }else{
                cart.products.push({product: productId,quantity});
            }

            cart.markModified("products");

            await cart.save();
            return cart;


        } catch (error) {
            console.log("Error al agregar un prodcuto al carrito",error);
         
        }
    }

}



module.exports = CartManager;