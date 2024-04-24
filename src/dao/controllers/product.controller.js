const ProductRepository = require('../../repository/productRepository.js');
const productRepository = new ProductRepository();

class ProductController {
  async getProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;

      const products = await productRepository.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
      });
      res.json({
        status: 'success',
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
          : null,
        nextLink: products.hasNextPage
          ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
          : null,
      });
    } catch (error) {
      req.logger.info('Error al obtener productos:', error);
      res
        .status(500)
        .json({ status: 'error', error: 'Error interno del servidor' });
    }
  }

  async addProduct(req, res) {
    const newProduct = req.body;
    try {
      await productRepository.addProduct(newProduct);
      res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ message: 'Error al agregar el producto' });
    }
  }

  async getProductById(req, res) {
    const productId = req.params.pid;
    try {
      const product = await productRepository.getProductById(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado!' });
      }
    } catch (error) {
      req.logger.error('Error al obtener producto por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async updateProduct(req, res) {
    const productId = req.params.pid;
    const productUpdate = req.body;

    try {
      await productRepository.updateProduct(productId, productUpdate);
      res.json({ message: 'Producto Actualizado Exitosamente' });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ message: 'Error al actualizar el producto' });
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.pid;

    try {
      await productRepository.deleteProduct(productId);
      res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      req.logger.error(Error);
      res.status(500).json({ message: 'Error al eliminar el producto' });
    }
  }
}

module.exports = ProductController;
