const ProductModel = require("../models/product.model.js");

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

    console.log("Intentando agergar un nuevo producto");
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
        console.log('Todos los campos son obligatorios');
        return;
      }

   
      const existProduct = await ProductModel.findOne({ code: code });

      if (existProduct) {
        console.log('El código debe ser único');
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
      console.log ("Product agregado exitosamente, newProduct");
    } catch (error) {
      console.log('Error al agregar producto', error);
      throw error;
    }
  }

  
  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      console.log('Error al obtener los productos', error);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        console.log('Producto no encontradooo', id);
        return null;
      }

      console.log('Producto encontrado Exitosamente', product);
      return product;
    } catch (error) {
      console.log('Error al encontrar producto por ID ', error);
    }
  }

  async updateProduct(id, productUpdate) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        productUpdate
      );

      if (!updatedProduct) {
        console.log('No se encuentra el prodcucto');
        return null;
      }
      console.log('Prodcuto Actualizado Exitosamente');
      return updatedProduct;
    } catch (error) {
      console.log('Error al actualizar el producto', error);
    }
  }

  async deleteProduct(id) {
    try {
      const productDelete = await ProductModel.findByIdAndDelete(id);

      if (!productDelete) {
        console.log('Producto no encontrado');
        return null;
      }
      console.log('Producto Eliminado Exitosamente');
    } catch (error) {
      console.log('Error al Eliminar el Producto', error);
      throw error;
    }
  }
}

module.exports = ProductManager;


