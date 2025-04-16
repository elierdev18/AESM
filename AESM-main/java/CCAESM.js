// carrito.js

// Arreglo para almacenar los productos del carrito
const carrito = [];

// Cargar carrito del localStorage si existe
document.addEventListener('DOMContentLoaded', () => {
  const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
  if (carritoGuardado) {
    carrito.push(...carritoGuardado);
    mostrarCarrito();
  }

  const botones = document.querySelectorAll('.agregar');
  botones.forEach(boton => {
    boton.addEventListener('click', agregarProducto);
  });
});

// Función para agregar un producto al carrito
function agregarProducto(e) {
  const productoElement = e.target.closest('.producto');
  const producto = {
    id: productoElement.getAttribute('data-id'),
    nombre: productoElement.getAttribute('data-nombre'),
    precio: parseFloat(productoElement.getAttribute('data-precio')),
    cantidad: 1
  };

  // Verificar si el producto ya existe en el carrito
  const existe = carrito.some(item => item.id === producto.id);
  if (existe) {
    carrito.forEach(item => {
      if (item.id === producto.id) {
        item.cantidad++;
      }
    });
  } else {
    carrito.push(producto);
  }
  mostrarCarrito();
}

// Función para mostrar el contenido del carrito
function mostrarCarrito() {
  const listaCarrito = document.getElementById('listaCarrito');
  listaCarrito.innerHTML = '';

  carrito.forEach((producto, index) => {
    const li = document.createElement('li');
    
    li.innerHTML = `<span>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</span>
                    <button onclick="eliminarProducto(${index})">Eliminar</button>`;
    
    listaCarrito.appendChild(li);
  });

  guardarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
  carrito.splice(index, 1);
  mostrarCarrito();
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}
