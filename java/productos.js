// Datos de ejemplo
const products = [
    { id: 1, title: "Producto 1", description: "Descripción del producto 1", image: "https://via.placeholder.com/300x200", category: "electronica", price: 200, brand: "marcaA" },
    { id: 2, title: "Producto 2", description: "Descripción del producto 2", image: "https://via.placeholder.com/300x200", category: "ropa", price: 50, brand: "marcaB" },
    { id: 3, title: "Producto 3", description: "Descripción del producto 3", image: "https://via.placeholder.com/300x200", category: "hogar", price: 150, brand: "marcaC" },
    { id: 4, title: "Producto 4", description: "Descripción del producto 4", image: "https://via.placeholder.com/300x200", category: "electronica", price: 300, brand: "marcaA" },
    { id: 5, title: "Producto 5", description: "Descripción del producto 5", image: "https://via.placeholder.com/300x200", category: "ropa", price: 80, brand: "marcaB" },
    { id: 6, title: "Producto 6", description: "Descripción del producto 6", image: "https://via.placeholder.com/300x200", category: "hogar", price: 120, brand: "marcaC" },
    { id: 7, title: "Producto 7", description: "Descripción del producto 7", image: "https://via.placeholder.com/300x200", category: "electronica", price: 400, brand: "marcaA" },
    { id: 8, title: "Producto 8", description: "Descripción del producto 8", image: "https://via.placeholder.com/300x200", category: "ropa", price: 60, brand: "marcaB" },
    { id: 9, title: "Producto 9", description: "Descripción del producto 9", image: "https://via.placeholder.com/300x200", category: "hogar", price: 220, brand: "marcaC" }
  ];
  
  // Variables de paginación y filtrado
  let currentPage = 1;
  const productsPerPage = 3;
  let filteredProducts = products.slice();
  
  // Función para renderizar los productos en el grid
  function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = filteredProducts.slice(start, end);
  
    productsToShow.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h4>${product.title}</h4>
        <p>${product.description}</p>
        <p><strong>$${product.price}</strong></p>
        <button onclick="alert('Detalles de ${product.title}')">Ver detalles</button>
      `;
      grid.appendChild(card);
    });
    renderPagination();
  }
  
  // Función para renderizar la paginación
  function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
    // Botón "Anterior"
    const prevLi = document.createElement('li');
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Anterior';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
      }
    });
    prevLi.appendChild(prevBtn);
    pagination.appendChild(prevLi);
  
    // Botones de página
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) {
        btn.style.backgroundColor = 'gray';
      }
      btn.addEventListener('click', () => {
        currentPage = i;
        renderProducts();
      });
      li.appendChild(btn);
      pagination.appendChild(li);
    }
  
    // Botón "Siguiente"
    const nextLi = document.createElement('li');
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Siguiente';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
      }
    });
    nextLi.appendChild(nextBtn);
    pagination.appendChild(nextLi);
  }
  
  // Función para aplicar filtros
  function applyFilters() {
    const activeCategoryElem = document.querySelector('.sidebar ul li a.active');
    const selectedCategory = activeCategoryElem ? activeCategoryElem.getAttribute('data-category') : 'todos';
    const priceValue = document.getElementById('price-range').value;
    const selectedBrand = document.getElementById('brand-select').value;
  
    filteredProducts = products.filter(product => {
      const categoryMatch = (selectedCategory === 'todos') || (product.category === selectedCategory);
      const priceMatch = product.price <= priceValue;
      const brandMatch = (selectedBrand === 'todos') || (product.brand === selectedBrand);
      return categoryMatch && priceMatch && brandMatch;
    });
    currentPage = 1;
    renderProducts();
  }
  
  // Eventos para los filtros
  document.getElementById('apply-filters').addEventListener('click', (e) => {
    e.preventDefault();
    applyFilters();
  });
  
  document.getElementById('price-range').addEventListener('input', (e) => {
    document.getElementById('price-value').textContent = e.target.value;
  });
  
  // Eventos para las categorías
  const categoryLinks = document.querySelectorAll('.sidebar ul li a');
  categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      categoryLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      applyFilters();
    });
  });
  
  // Inicializar la visualización de productos
  renderProducts();