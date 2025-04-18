$(document).ready(function(){

	// AGREGANDO CLASE ACTIVE AL PRIMER ENLACE ====================
	$('.category-list .category_Items[category="all"]').addClass('ct_item_active');

	// FILTRANDO PRODUCTOS  ============================================

	$('.category_Items').click(function(){
		var catProduct = $(this).attr('category');
		console.log(catProduct);

		// AGREGANDO CLASE ACTIVE AL ENLACE SELECCIONADO
		$('.category_Items').removeClass('ct_item_active');
		$(this).addClass('ct_item_active');

		// OCULTANDO PRODUCTOS =========================
		$('.product-item').hide();

		// MOSTRANDO PRODUCTOS =========================
			$('.product-item[category="'+catProduct+'"]').show();
	});

  $('.product-item[category="all"]').click(function(){
    $('product-item').show();
  });
});  


	// MOSTRANDO TODOS LOS PRODUCTOS ======================


  $(document).ready(function(){
    const productsPerPage = 6; // Productos por página
    let currentPage = 1;
    let totalPages = 1;
    let currentCategory = 'all';

    // Función principal para filtrar y paginar
    function filterAndPaginate(category) {
        currentCategory = category;
        
        // Obtener productos visibles
        let visibleProducts = (category === 'all') 
            ? $('.product-item') 
            : $(`.product-item[category="${category}"]`);
        
        // Calcular paginación
        totalPages = Math.ceil(visibleProducts.length / productsPerPage);
        
        // Mostrar productos para la página actual
        showPage(currentPage, visibleProducts);
        
        // Generar controles de paginación
        generatePagination();
    }

    function showPage(page, products) {
        currentPage = page;
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        
        // Ocultar todos los productos primero
        $('.product-item').hide();
        
        // Mostrar solo los productos del rango actual
        products.slice(start, end).show();
    }

    function generatePagination() {
        const pagination = $('.pagination');
        pagination.empty();

        // Botones de página
        for(let i = 1; i <= totalPages; i++) {
            pagination.append(
                `<a href="#" class="page-link ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`
            );
        }

        // Agregar botones anterior/siguiente si hay múltiples páginas
        if(totalPages > 1) {
            pagination.prepend(
                `<a href="#" class="page-link prev" data-page="prev">&laquo; Anterior</a>`
            );
            pagination.append(
                `<a href="#" class="page-link next" data-page="next">Siguiente &raquo;</a>`
            );
        }
    }

    // Eventos
    $(document).on('click', '.category_Items', function(e) {
        e.preventDefault();
        $('.category_Items').removeClass('ct_item_active');
        $(this).addClass('ct_item_active');
        currentPage = 1;
        filterAndPaginate($(this).attr('category'));
    });

    $(document).on('click', '.page-link', function(e) {
        e.preventDefault();
        const action = $(this).data('page');
        
        if(action === 'prev' && currentPage > 1) currentPage--;
        else if(action === 'next' && currentPage < totalPages) currentPage++;
        else if(typeof action === 'number') currentPage = action;
        
        filterAndPaginate(currentCategory);
    });

    // Inicializar con la categoría "Todos"
    filterAndPaginate('all');
});

// Actualiza el JavaScript para el slider de rango
$(document).ready(function(){
  // ... variables existentes ...
  let currentMinPrice = 0;
  let currentMaxPrice = 1000;

  // Obtener precios máximos y mínimos reales de los productos
  function getPriceLimits() {
      let prices = [];
      $('.product-item').each(function() {
          const priceText = $(this).find('h1').text();
          prices.push(parseFloat(priceText.replace(/[^0-9.]/g, '')));
      });
      return {
          min: Math.min(...prices),
          max: Math.max(...prices)
      }
  }

  // Inicializar sliders con valores reales
  const priceLimits = getPriceLimits();
  $('#minPrice').attr({'min': priceLimits.min, 'max': priceLimits.max, 'value': priceLimits.min});
  $('#maxPrice').attr({'min': priceLimits.min, 'max': priceLimits.max, 'value': priceLimits.max});
  
  // Actualizar valores visuales
  function updatePriceValues() {
      $('#minValue').text(`$${currentMinPrice}`);
      $('#maxValue').text(`$${currentMaxPrice}`);
  }

  // Eventos para los sliders
  $('.price-slider').on('input', function() {
      let minVal = parseInt($('#minPrice').val());
      let maxVal = parseInt($('#maxPrice').val());
      
      // Evitar que los sliders se crucen
      if(minVal > maxVal) {
          [minVal, maxVal] = [maxVal, minVal];
          $('#minPrice').val(minVal);
          $('#maxPrice').val(maxVal);
      }
      
      currentMinPrice = minVal;
      currentMaxPrice = maxVal;
      
      updatePriceValues();
      filterAndPaginate(currentCategory);
  });

  // Actualizar función de filtrado
  function filterByPrice(products) {
      return products.filter(function() {
          const priceText = $(this).find('h1').text();
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          return price >= currentMinPrice && price <= currentMaxPrice;
      });
  }

  // Inicializar valores
  currentMinPrice = priceLimits.min;
  currentMaxPrice = priceLimits.max;
  updatePriceValues();
  
  // ... resto del código existente ...
});