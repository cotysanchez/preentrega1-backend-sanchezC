const socket = require('socket.io');
const ProductRepository = require('../repository/productRepository.js');
const productRepository = new ProductRepository();
const MessageModel = require('../dao/models/message.model.js');

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on('connection', async (socket) => {
      req.logger.info('Un cliente se conectó');

      socket.emit('products', await productRepository.getProducts());

      socket.on('deleteProduct', async (id) => {
        await productRepository.deleteProduct(id);
        this.emitUpdatedProducts(socket);
      });

      socket.on('addProduct', async (product) => {
        await productRepository.addProduct(product);
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
    socket.emit('products', await productRepository.getProducts());
  }
}

module.exports = SocketManager;
