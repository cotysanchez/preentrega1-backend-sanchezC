//const CartModel = require('../models/cart.model.js');
const CartService = require("../../services/cartService.js");
const cartService = new CartService();


class CartController {
    async createCart(req,res){
        try {
            const newCart = await cartService.createCart();
            res.json(newCart);
        } catch (error) {
        console.error('Error al crear un Nuevo Carrito', error);
        res.status(500).json({ error: 'Error Interno del Servidor' });
        }
    }

    async getCartById(req,res){
        const cartId = req.params.cid;

        try {
            const cart = await cartService.findById(cartId);
            if(!cart){
            console.log("No existe el Carrito con ese ID");
            return res.status(404).json({error: "Carrito no encontrado"});
            }

            return res.json(cart.products);

        } catch (error) {
            console.error('Error al obtener el Carrito', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async addProductToCart(req,res){
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            const updateCart = await cartService.addProductToCart(
            cartId,
            productId,
            quantity
            );
            res.json(updateCart.products);
        } catch (error) {
            console.error('Error  al agregar producto al Carrito', error);
            res.status(500).json({ error: 'Error del Servidor' });
        }
    }

    async deleteProductToCart(req,res){
        try {
            const cartId= req.params.cid;
            const productId= req.params.pid;
            const updatedCart= await cartService.deleteProductToCart(cartId,productId);

            res.json({
            status: "success",
            message: "Producto eliminado del Carrito Exitosamente", updatedCart,
        });

        } catch (error) {
            console.error('Error al eliminar el producto del carrito', error);
            res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
            });
        }
    }

    async updateCart(req,res){
        const cartId= req.params.cid;
        const updatedProducts= req.body;

        try {
            const updatedCart= await cartService.updateCart(cartId, updatedProducts);
            res.json (updatedCart);

        } catch (error) {
            console.error("Error al acutualizar el Carrito", error);
            res.status(500).json({
            status: "error", error: "Error Interno del Servidor",
            });
        }
    }

    async updateQuantityProduct(req,res){
         try {
            const cartId= req.params.cid;
            const productId= req.params.pid;
            const newQuantity= parseInt(req.body.quantity);

            const updatedCart= await cartService.updateQuantityProduct(cartId, productId, newQuantity);
            res.json({
            status:"success", message:"Cantidad del producto actualizada exitosamente",
            updatedCart
            });

        } catch (error) {
            console.error("Error al actualizar la cantidad del prducto en el Carrito", error);
            res.status(500).json({
                status: "error", error: "Error Interno del Servidor",
            });
        }
    }

    async emptyCart(req,res){
        try {
            const cartId = req.params.cid;
            const updatedCart= await cartService.emptyCart(cartId);
            res.json({status: "success", message: "Todod los productos del carrito fueron eliminados exitosamente",updatedCart,});
        } catch (error) {
            console.error('Error al vaciar el carrito', error);
            res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor'
            });
        }
    }

    //GET - mostrar en /carts/:cid los productos que pertenecen a dicho carrito
    async cartCid (req,res){
        const cartId= req.params.cid;
        try {
            const cart = await cartService.getCartById(cartId);

        if(!cart){
            console.log(" No existe el carrito con este ID");
            return res.status(404).json({error: "Carrito no encontrado"})
        }

        const productsInCart= cart.products.map(item =>({
            product: item.product.toObject(),
            quantity: item.quantity,
        }));
    res .render("carts",{products: productsInCart});


    } catch (error) {
        console.error("Error al obtener el Carrito", error);
        res.status(500).json ({error: "Error interno del Servidor"});
    }

    }


}
module.exports = CartController;

