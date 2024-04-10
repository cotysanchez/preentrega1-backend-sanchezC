const socket= require("socket.io");
const ProductService= require("../services/productService.js");
const productService= new ProductService();
const MessageModel = require ("../dao/models/message.model.js");


class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on('connection', async (socket) => {
      console.log('Un cliente se conectó');

      socket.emit('products', await productService.getProducts());

      socket.on('deleteProduct', async (id) => {
        await productService.deleteProduct(id);
        this.emitUpdatedProducts(socket);
      });

      socket.on('addProduct', async (product) => {
        await productService.addProduct(product);
        this.emitUpdatedProducts(socket);
      });

      socket.on('message', async (data) => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        socket.emit('message', messages);
      });
    });
  }

  async emitUpdatedProducts(socket) {
    socket.emit('products', await productService.getProducts());
  }
}

module.exports = SocketManager;
