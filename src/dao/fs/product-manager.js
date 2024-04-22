const fs = require('fs');

class ProductManager {
  //static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar productos:', error.message);
    }
  }

  async addProduct(nuevoObjeto) {
    let {
      title,
      description,
      price,
      thumbnail = [],
      code,
      stock,
      status = true,
      category,
    } = nuevoObjeto;

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
      console.log(' Todos los campos son Obligatorios');
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log('El codigo debe ser unico');
      return;
    }

    const newProduct = {
      //id: ++ProductManager.ultId,
      id: this.getNextProductId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    };

    this.products.push(newProduct);
    await this.guardarArchivo(this.products);
  }

  getNextProductId() {
    const maxId = this.products.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );
    return maxId + 1;
  }

  getProducts() {
    return this.products;
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (!buscado) {
        console.log('Producto no encontrado');
        return null;
      } else {
        console.logoducto encontrado');
        return buscado;
      }
    } catch (error) {
      console.log('Error al leer el archivo', error);
    }
  }

  async leerArchivo() {
    try {
      const respuesta = fs.readFileSync(this.path, 'utf-8');
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log('Error al leer un Archivo', error);
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (eror) {
      console.log('Error al Guardar el Archivo', error);
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        const actualizacionProduct = {
          id: arrayProductos[index].id,
          title: productoActualizado.title
            ? productoActualizado.title
            : arrayProductos[index].title,
          description: productoActualizado.description
            ? productoActualizado.description
            : arrayProductos[index].description,
          price: productoActualizado.price
            ? productoActualizado.price
            : arrayProductos[index].price,
          thumbnail: productoActualizado.thumbnail
            ? productoActualizado.thumbnail
            : arrayProductos[index].thumbnail,
          code: productoActualizado.code
            ? productoActualizado.code
            : arrayProductos[index].code,
          stock: productoActualizado.stock
            ? productoActualizado.stock
            : arrayProductos[index].stock,
          status: productoActualizado.status
            ? productoActualizado.status
            : arrayProductos[index].status,
          category: productoActualizado.category
            ? productoActualizado.category
            : arrayProductos[index].category,
        };
        arrayProductos[index] = actualizacionProduct;
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log('No se encontro el producto');
      }
    } catch (error) {
      console.logror al Actualizar el Producto', error);
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const newArray = arrayProductos.filter((item) => item.id !== id);
      await this.guardarArchivo(newArray);
    } catch (error) {
      console.log('Error al borrar el Producto', error);
    }
  }

  async getProductsLimit(limit) {
    const arrayProductos = await this.leerArchivo();
    if (limit) {
      return arrayProductos.slice(0, limit);
    }
    return arrayProductos;
  }
}

module.exports = ProductManager;
