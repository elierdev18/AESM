$(document).ready(function() {
  const productsPerPage = 6; // Productos por página
  let currentPage = 1;
  let totalPages = 1;
  let currentCategory = 'all';
  let currentMinPrice = 0;
  let currentMaxPrice = 1000;

  // Obtener precios máximos y mínimos reales de los productos
  function getPriceLimits() {
      let prices = [];
      $('.product-item').each(function() {
          const price = parseFloat($(this).data('price'));
          if (!isNaN(price)) {
              prices.push(price);
          }
      });
      return {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 1000
      };
  }

  // Inicializar sliders con valores reales
  const priceLimits = getPriceLimits();
  $('#minPrice').attr({ 'min': priceLimits.min, 'max': priceLimits.max, 'value': priceLimits.min });
  $('#maxPrice').attr({ 'min': priceLimits.min, 'max': priceLimits.max, 'value': priceLimits.max });
  currentMinPrice = priceLimits.min;
  currentMaxPrice = priceLimits.max;
  updatePriceValues();

  // Actualizar valores visuales del slider
  function updatePriceValues() {
      $('#minValue').text(`$${currentMinPrice}`);
      $('#maxValue').text(`$${currentMaxPrice}`);
  }

  // Función principal para filtrar por categoría y precio, y luego paginar
  function filterAndPaginate(category, minPrice, maxPrice) {
      currentCategory = category;
      currentMinPrice = minPrice;
      currentMaxPrice = maxPrice;

      // Obtener productos visibles según categoría
      let visibleProducts = (category === 'all')
          ? $('.product-item')
          : $(`.product-item[category="${category}"]`);

      // Filtrar productos visibles por precio
      visibleProducts = visibleProducts.filter(function() {
          const price = parseFloat($(this).data('price'));
          return !isNaN(price) && price >= minPrice && price <= maxPrice;
      });

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
      for (let i = 1; i <= totalPages; i++) {
          pagination.append(
              `<a href="#" class="page-link ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`
          );
      }

      // Agregar botones anterior/siguiente si hay múltiples páginas
      if (totalPages > 1) {
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
      filterAndPaginate($(this).attr('category'), currentMinPrice, currentMaxPrice);
  });

  $(document).on('click', '.page-link', function(e) {
      e.preventDefault();
      const action = $(this).data('page');

      if (action === 'prev' && currentPage > 1) currentPage--;
      else if (action === 'next' && currentPage < totalPages) currentPage++;
      else if (typeof action === 'number') currentPage = action;

      filterAndPaginate(currentCategory, currentMinPrice, currentMaxPrice);
  });

  // Eventos para los sliders de precio
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
      currentPage = 1; // Resetear la página al filtrar por precio
      filterAndPaginate(currentCategory, currentMinPrice, currentMaxPrice);
  });

  // Inicializar con la categoría "Todos" y el rango de precio inicial
  filterAndPaginate('all', currentMinPrice, currentMaxPrice);
});