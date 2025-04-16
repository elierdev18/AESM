// admin.js

// --- Datos (Idealmente, esto vendría de un backend) ---
// Copiamos los datos iniciales de productos.js para simulación
// En una aplicación real, NO deberías tener los datos duplicados aquí.
let products = [
    { id: 1, title: "Plana electronica Kingter", description: "La Plana Electrónica Kingter KT D7 es una máquina...", image: "https://maquinasdeconfeccion.com/producto/maquina-plana-mecatronica-con-cortahilo-kingter-kt-d7-t/", category: "Maquina", price: 2500000, brand: "marcaA" }, // Ajusta precios si es necesario
    { id: 2, title: "Fileteadora electronica kingter", description: "La fileteadora electrónica Kingter es una máquina...", image: "...", category: "Maquina", price: 3200000, brand: "marcaB" },
    { id: 3, title: "Collarin electronica kingter", description: "La Collarín Mecatrónica Kingter KT‑500‑DDi es una recubridora...", image: "...", category: "Maquina", price: 3800000, brand: "marcaC" },
    // Añade el resto de productos de productos.js si quieres empezar con ellos
    // ... (Asegúrate de que los precios coincidan con lo que quieres mostrar/usar)
];
// Función para generar un ID simple (para simulación)
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}


// --- Referencias a Elementos del DOM ---
const addProductForm = document.getElementById('add-product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productDescriptionInput = document.getElementById('product-description');
const productImageInput = document.getElementById('product-image');
const productBrandInput = document.getElementById('product-brand');
const productCategoryInput = document.getElementById('product-category'); // Aunque sea readonly
const productListContainer = document.getElementById('product-list-container');


// --- Funciones ---

/**
 * Muestra los productos en la sección de gestión.
 */
function displayAdminProducts() {
    if (!productListContainer) return; // Seguridad por si el elemento no existe

    productListContainer.innerHTML = ''; // Limpia la lista actual

    if (products.length === 0) {
        productListContainer.innerHTML = '<p>No hay productos para mostrar.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <div class="product-item-info">
                <span class="name">${product.title}</span>
                <span class="price">COP ${product.price.toLocaleString('es-CO')}</span>
                <span class="brand">(${product.brand})</span>
            </div>
            <div class="product-item-actions">
                <button class="btn btn-delete" data-id="${product.id}">Eliminar</button>
            </div>
        `;
        productListContainer.appendChild(productElement);
    });
}

/**
 * Maneja el envío del formulario para añadir un nuevo producto.
 * @param {Event} event - El evento de envío del formulario.
 */
function handleAddProduct(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Obtener valores del formulario
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const description = productDescriptionInput.value.trim();
    const image = productImageInput.value.trim(); // Puede estar vacío
    const brand = productBrandInput.value;
    const category = productCategoryInput.value; // Aunque sea readonly

    // Validación simple (puedes añadir más)
    if (!name || isNaN(price) || price <= 0 || !description || !brand) {
        alert('Por favor, complete todos los campos requeridos correctamente.');
        return;
    }

    // Crear el nuevo objeto producto
    const newProduct = {
        id: generateId(), // Genera un ID único simple
        title: name,
        description: description,
        image: image || '../img/placeholder.png', // URL por defecto si no se proporciona imagen
        category: category,
        price: price,
        brand: brand
    };

    // Añadir al array local (Simulación)
    products.push(newProduct);

    // Limpiar el formulario
    addProductForm.reset();

    // Volver a mostrar la lista actualizada
    displayAdminProducts();

    alert('¡Producto añadido con éxito! (Recuerda: este cambio es solo local)');
    console.log("Lista de productos actualizada:", products); // Para depuración
}

/**
 * Maneja el clic en los botones de la lista de productos (delegación de eventos).
 * @param {Event} event - El evento de clic.
 */
function handleProductListClick(event) {
    // Verificar si se hizo clic en un botón de eliminar
    if (event.target.classList.contains('btn-delete')) {
        const button = event.target;
        const productId = parseInt(button.dataset.id); // Obtener el ID del atributo data-id

        // Confirmación antes de eliminar
        if (confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${productId}?`)) {
            // Filtrar el array para quitar el producto (Simulación)
            products = products.filter(product => product.id !== productId);

            // Volver a mostrar la lista actualizada
            displayAdminProducts();

            alert('¡Producto eliminado con éxito! (Recuerda: este cambio es solo local)');
            console.log("Lista de productos actualizada:", products); // Para depuración
        }
    }
}


// --- Inicialización y Event Listeners ---

// Mostrar productos iniciales al cargar la página
document.addEventListener('DOMContentLoaded', displayAdminProducts);

// Listener para el formulario de añadir producto
if (addProductForm) {
    addProductForm.addEventListener('submit', handleAddProduct);
}

// Listener para clics en la lista de productos (para botones de eliminar)
if (productListContainer) {
    productListContainer.addEventListener('click', handleProductListClick);
}