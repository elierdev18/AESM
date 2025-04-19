"use strict";

// --- Referencias a Elementos del DOM ---
const addProductForm = document.getElementById('add-product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productDescriptionInput = document.getElementById('product-description');
const productImageInput = document.getElementById('product-image');
const productBrandInput = document.getElementById('product-brand');
const productCategoryInput = document.getElementById('product-category');
const productListContainer = document.getElementById('product-list-container');

let listaDeProductos = []; // Array global para almacenar los productos

// --- Función para obtener los productos desde el servidor ---
async function obtenerProductos() {
    try {
        const response = await fetch("../php/obtener_productos.php");
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(`Error HTTP ${response.status}: ${errorData?.error || response.statusText}`);
        }
        const products = await response.json();
        if (Array.isArray(products)) {
            listaDeProductos = products;
        } else if (products.error) {
            throw new Error(products.error);
        } else {
            throw new Error("Respuesta inesperada del servidor.");
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        if (productListContainer) {
            productListContainer.innerHTML = `<p class="error" style="color:red;">Error al cargar productos: ${error.message}</p>`;
        }
        listaDeProductos = [];
    }
}

// --- Función para mostrar los productos en la sección de administración ---
function mostrarProductosAdmin() {
    if (!productListContainer) {
        console.error("Contenedor de lista de productos no encontrado.");
        return;
    }
    productListContainer.innerHTML = "";
    if (listaDeProductos.length === 0) {
        productListContainer.innerHTML = "<p>No hay productos para mostrar.</p>";
        return;
    }
    listaDeProductos.forEach(producto => {
        const elementoProducto = document.createElement("div");
        elementoProducto.classList.add("product-item");
        const precioFormateado = (typeof producto.precio === "number" || !isNaN(parseFloat(producto.precio)))
            ? parseFloat(producto.precio).toLocaleString('es-CO')
            : "Precio inválido";
        // Se añade el botón de eliminar
        elementoProducto.innerHTML = `
            <div class="product-item-info">
                <span class="name">${producto.nombre || "Nombre no disponible"}</span>
                <span class="price">COP ${precioFormateado}</span>
                <span class="brand">(${producto.nombre_marca || "Marca no disponible"})</span>
            </div>
            <div class="product-item-actions">
                <button class="btn btn-delete" data-id="${producto.producto_id}">Eliminar</button>
            </div>
        `;
        productListContainer.appendChild(elementoProducto);
    });
}

// --- Función para manejar el envío del formulario y agregar un nuevo producto ---
async function manejarAgregarProducto(event) {
    event.preventDefault();

    // Recopilar los datos del formulario
    const nombre = productNameInput.value.trim();
    const precio = parseFloat(productPriceInput.value);
    const descripcion = productDescriptionInput.value.trim();
    const url_imagen = productImageInput.value.trim();
    const marca_id = productBrandInput.value;
    const categoria_nombre = productCategoryInput.value.trim();

    // Validación básica
    if (!nombre || isNaN(precio) || precio <= 0 || !descripcion || !marca_id || !categoria_nombre) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    // Preparar el objeto con los datos del producto
    const datosProducto = {
        nombre: nombre,
        precio: precio,
        descripcion: descripcion,
        url_imagen: url_imagen,
        marca_id: parseInt(marca_id),
        categoria_nombre: categoria_nombre
    };

    // Desactivar el botón para evitar envíos múltiples y dar feedback visual
    const botonSubmit = addProductForm.querySelector('button[type="submit"]');
    botonSubmit.disabled = true;
    botonSubmit.textContent = "Añadiendo...";

    try {
        const response = await fetch("../php/agregar_producto.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosProducto)
        });
        const resultado = await response.json();
        console.log("Respuesta del servidor:", resultado);
        if (!response.ok) {
            throw new Error(resultado.error || `Error HTTP ${response.status}`);
        }
        if (resultado.success) {
            alert(resultado.message || "¡Producto añadido con éxito!");
            addProductForm.reset();
            await obtenerProductos();
            mostrarProductosAdmin();
        } else {
            throw new Error(resultado.error || "Error desconocido al añadir el producto");
        }
    } catch (error) {
        console.error("Error al agregar producto:", error);
        alert(`Error al agregar producto: ${error.message}`);
    } finally {
        botonSubmit.disabled = false;
        botonSubmit.textContent = "Añadir Producto";
    }
}

// --- Función para manejar el clic en los botones de eliminación ---
function manejarClicListaProductos(event) {
    const botonEliminar = event.target.closest('.btn-delete[data-id]');
    if (botonEliminar) {
        const productoId = parseInt(botonEliminar.dataset.id);
        if (confirm(`¿Estás seguro de eliminar el producto con ID ${productoId}?`)) {
            eliminarProducto(productoId);
        }
    }
}

// --- Función para eliminar el producto en la base de datos ---
async function eliminarProducto(producto_id) {
    try {
        const response = await fetch("../php/eliminar_producto.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ producto_id: producto_id })
        });
        const result = await response.json();
        console.log("Respuesta de eliminación:", result);
        if (!response.ok) {
            throw new Error(result.error || `Error HTTP ${response.status}`);
        }
        if (result.success) {
            alert(result.message || "Producto eliminado correctamente.");
            await obtenerProductos();
            mostrarProductosAdmin();
        } else {
            throw new Error(result.error || "Error desconocido al eliminar el producto.");
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Error al eliminar producto: " + error.message);
    }
}

// --- Inicialización y asignación de eventos ---
document.addEventListener("DOMContentLoaded", async () => {
    if (productListContainer) {
        productListContainer.innerHTML = "<p>Cargando productos...</p>";
        await obtenerProductos();
        mostrarProductosAdmin();
        productListContainer.addEventListener("click", manejarClicListaProductos);
    } else {
        console.error("El elemento #product-list-container no se encontró en el DOM.");
    }
    if (addProductForm) {
        addProductForm.addEventListener("submit", manejarAgregarProducto);
    } else {
        console.error("Formulario para agregar producto no encontrado.");
    }
});
