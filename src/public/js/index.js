const socket = io();

socket.on('products', (data) => {
  renderProductos(data);
});

const renderProductos= (products) => {
  const productContainer = document.getElementById('productContainer');
  productContainer.innerHTML = "";

  products.forEach((product)=>{
    const card= document.createElement("div");
    
    card.classList.add("card");

    card.innerHTML = `
    <img src="https://placekitten.com/200/286" class="card-img-top" alt="gatito">
    <p> Id ${product.id}</p>
    <h2> ${product.title}</h2>
    <p>Precio $${product.price}</p>
    <button>Eliminar Producto</button>
    `;

    productContainer.appendChild(card);

    card.querySelector("button").addEventListener("click", ()=> {
       eliminarProducto(product.id);
    });  
});
} 

const eliminarProducto = (id) =>{
  socket.emit("eliminarProducto", id);
}

document.getElementById("btnEnviar").addEventListener("click", ()=>{
  agregarProducto();
});

const agregarProducto =() =>{
  const product = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    img: document.getElementById('img').value,
    code: document.getElementById('code').value,
    stock: document.getElementById('stock').value,
    category: document.getElementById('category').value,
    status: document.getElementById('status').value === "true"
  };

  socket.emit("agregarProducto", product);
}





