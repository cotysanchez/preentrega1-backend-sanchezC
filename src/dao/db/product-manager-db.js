const ProductModel = require('../models/product.model.js');

class ProductManager {
  async addProduct({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
  }) {
    req.logger.info('Intentando agergar un nuevo producto');
    try {
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !status ||
        !category
      ) {
        req.logger.info('Todos los campos son obligatorios');
        return;
      }

      const existProduct = await ProductModel.findOne({ code: code });

      if (existProduct) {
        req.logger.info('El código debe ser único');
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        thumbnail: thumbnail || [],
        code,
        stock,
        status: true,
        category,
      });

      await newProduct.save();
      req.logger.info('Producto agregado exitosamente, newProduct');
    } catch (error) {
      req.logger.info('Error al agregar producto', error);
      throw error;
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const skip = (page - 1) * limit;
      let queryOptions = {};
      if (query) {
        queryOptions = { category: query };
      }
      const sortOptions = {};
      if (sort) {
        if (sort === 'asc' || sort === 'desc') {
          sortOptions.price = sort === 'asc' ? 1 : -1;
        }
      }

      const products = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
      const totalProducts = await ProductModel.countDocuments(queryOptions);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      req.logger.info('Error al obtener los productos', error);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        req.logger.info('Producto no encontradooo', id);
        return null;
      }

      req.logger.info('Producto encontrado Exitosamente', product);
      return product;
    } catch (error) {
      req.logger.info('Error al encontrar producto por ID ', error);
    }
  }

  async updateProduct(id, productUpdate) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        productUpdate
      );

      if (!updatedProduct) {
        req.logger.info('No se encuentra el prodcucto');
        return null;
      }
      req.logger.info('Prodcuto Actualizado Exitosamente');
      return updatedProduct;
    } catch (error) {
      req.logger.info('Error al actualizar el producto', error);
    }
  }

  async deleteProduct(id) {
    try {
      const productDelete = await ProductModel.findByIdAndDelete(id);

      if (!productDelete) {
        req.logger.info('Producto no encontrado');
        return null;
      }
      req.logger.info('Producto Eliminado Exitosamente');
    } catch (error) {
      req.logger.info('Error al Eliminar el Producto', error);
      throw error;
    }
  }
}

module.exports = ProductManager;
