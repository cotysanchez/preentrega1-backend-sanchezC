const fs = require('fs');

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.ultId = 0;

    this.cargarCarritos();
  }

  async cargarCarritos() {
    try {
      const data = await fs.readFileSync(this.path, 'utf8');
      this.carts = JSON.parse(data);
      if (this.carts.length > 0) {
        this.ultId = Math.max(...this.carts.map((cart) => cart.id));
      }
    } catch (error) {
      console.error('Error al cargar los carritos', error);
      await this.guardarCarritos();
    }
  }

 
  async guardarCarritos() {
    await fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
  }


  async crearCarrito() {
    const nuevoCarrito = {
      id: ++this.ultId,
      products: [],
    };

    this.carts.push(nuevoCarrito);

    await this.guardarCarritos();
    return nuevoCarrito;
  }


  async getCarritoById(cartId) {
    try {
      const carrito = this.carts.find((c) => c.id === cartId);
      if (!carrito) {
        throw new Error(`No existe el carrito con el Id ${cartId}`);
      }
      return carrito;
    } catch (error) {
      console.error('Error al obtener el carrito por Id', error);
      throw error;
    }
  }


  async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
    const carrito = await this.getCarritoById(cartId);
    const existeProducto = carrito.products.find(
      (p) => p.product === productId
    );

    if (existeProducto) {
      existeProducto.quantity += quantity;
    } else {
      carrito.products.push({ product: productId, quantity });
    }

    await this.guardarCarritos();
    return carrito;
  }
}

module.exports = CartManager;
