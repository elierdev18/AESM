$(document).ready(function() {
    const productsPerPage = 6; // Productos por página
    let currentPage = 1;
    let totalPages = 1;
    let currentMinPrice = 0;
    let currentMaxPrice = 1000;
    let allProducts = [];

    // Función para obtener los productos de la base de datos vía AJAX
    function obtenerProductos() {
        $.ajax({
            url: "../php/obtener_productos.php", // Asegúrate de que la ruta es correcta.
            method: "GET",
            dataType: "json",
            success: function(response) {
                console.log("Respuesta del servidor:", response);
                // Si la respuesta es un array, lo usamos directamente.
                if (Array.isArray(response)) {
                    allProducts = response;
                    renderizarProductos(allProducts);
                    actualizarRangoPrecios();
                    filterAndPaginate(currentMinPrice, currentMaxPrice);
                }
                // Si la respuesta es un objeto con success=true y la propiedad productos es un array:
                else if (response.success && Array.isArray(response.productos)) {
                    allProducts = response.productos;
                    renderizarProductos(allProducts);
                    actualizarRangoPrecios();
                    filterAndPaginate(currentMinPrice, currentMaxPrice);
                } else {
                    console.error("Error: no se recibieron productos válidos.", response.error);
                }
            },
            error: function(xhr, status, error) {
                console.error("Error en la solicitud AJAX:", error);
            }
        });
    }

    // Función para renderizar los productos en el contenedor principal
    function renderizarProductos(productos) {
        const productList = $('.product-list');
        productList.empty();
    
        productos.forEach(function(producto) {
            // Asegúrate de ajustar la URL de la imagen como lo hiciste antes:
            let urlImagen = producto.url_imagen;
            if (urlImagen && !urlImagen.startsWith("http") && !urlImagen.startsWith("/")) {
                urlImagen = "../" + urlImagen;
            }
    
            // Crear el HTML de cada producto con estructura separada
            const productoHTML = `
                <div class="product-item">
                    <div class="product-image">
                        ${ urlImagen ? `<img src="${urlImagen}" alt="${producto.nombre}">` : '' }
                    </div>
                    <div class="product-info">
                        <h2 class="product-name">${producto.nombre}</h2>
                        <p class="product-description">${producto.descripcion}</p>
                        <p class="product-price">Precio: $${parseFloat(producto.precio).toLocaleString('es-CO')}</p>
                    </div>
                </div>
            `;
            productList.append(productoHTML);
        });
    }
    
    
    // Función para actualizar el rango de precios en base a todos los productos obtenidos
    function actualizarRangoPrecios() {
        let precios = allProducts.map(p => p.precio);
        currentMinPrice = Math.min(...precios);
        currentMaxPrice = Math.max(...precios);

        $('#minPrice').attr({ 'min': currentMinPrice, 'max': currentMaxPrice, 'value': currentMinPrice });
        $('#maxPrice').attr({ 'min': currentMinPrice, 'max': currentMaxPrice, 'value': currentMaxPrice });

        updatePriceValues();
    }

    // Muestra los valores actuales de los sliders
    function updatePriceValues() {
        $('#minValue').text(`$${currentMinPrice}`);
        $('#maxValue').text(`$${currentMaxPrice}`);
    }

    // Filtra los productos por rango de precio y realiza la paginación
    function filterAndPaginate(minPrice, maxPrice) {
        let filteredProducts = allProducts.filter(function(p) {
            return p.precio >= minPrice && p.precio <= maxPrice;
        });
        totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (totalPages === 0) totalPages = 1;
        showPage(currentPage, filteredProducts);
        generatePagination();
    }

    function showPage(page, products) {
        currentPage = page;
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;

        // Ocultar todos los productos
        $('.product-list .product-item').hide();
        // Mostrar solamente los productos del rango
        $('.product-list .product-item').slice(start, end).show();
    }

    function generatePagination() {
        const pagination = $('.pagination');
        pagination.empty();

        for (let i = 1; i <= totalPages; i++) {
            pagination.append(
                `<a href="#" class="page-link ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`
            );
        }
        if (totalPages > 1) {
            pagination.prepend(
                `<a href="#" class="page-link prev" data-page="prev">&laquo; Anterior</a>`
            );
            pagination.append(
                `<a href="#" class="page-link next" data-page="next">Siguiente &raquo;</a>`
            );
        }
    }

    // Eventos para controles de paginación
    $(document).on('click', '.page-link', function(e) {
        e.preventDefault();
        const action = $(this).data('page');
        if (action === 'prev' && currentPage > 1) currentPage--;
        else if (action === 'next' && currentPage < totalPages) currentPage++;
        else if (typeof action === 'number') currentPage = action;
        filterAndPaginate(currentMinPrice, currentMaxPrice);
    });

    // Evento para los sliders de preço
    $('.price-slider').on('input', function() {
        let minVal = parseInt($('#minPrice').val());
        let maxVal = parseInt($('#maxPrice').val());

        // Evitar que los sliders se crucen
        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
            $('#minPrice').val(minVal);
            $('#maxPrice').val(maxVal);
        }
        currentMinPrice = minVal;
        currentMaxPrice = maxVal;
        updatePriceValues();
        currentPage = 1;
        filterAndPaginate(currentMinPrice, currentMaxPrice);
    });

    // Inicia la carga de productos
    obtenerProductos();
});
