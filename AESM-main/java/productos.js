// Datos de ejemplo
const products = [
    { id: 1, title: "Plana electronica Kingter", description: "La Plana Electrónica Kingter KT D7 es una máquina de coser industrial de puntada recta diseñada para maximizar la eficiencia en procesos de confección.", image: "https://maquinasdeconfeccion.com/producto/maquina-plana-mecatronica-con-cortahilo-kingter-kt-d7-t/", category: "Maquina", price: 200, brand: "marcaA" },
    { id: 2, title: "Fileteadora electronica kingter", description: "La fileteadora electrónica Kingter es una máquina industrial de overlock (fileteado) diseñada para unir y rematar bordes de tejido con alta productividad y acabado profesional.", image: "https://via.placeholder.com/300x200", category: "Maquina", price: 50, brand: "marcaB" },
    { id: 3, title: "Collarin electronica kingter", description: "La Collarín Mecatrónica Kingter KT‑500‑DDi es una recubridora de puntada cadeneta tipo collarín con recubridor superior, diseñada para la confección de prendas de punto ligeras y medianas (ropa interior, pijamas, camisetas, leggins, etc.)", image: "https://via.placeholder.com/300x200", category: "Maquina", price: 150, brand: "marcaC" },
    { id: 4, title: "Plana electronica Jontex", description: "La Plana Electrónica Jontex es una máquina de pespunte computarizada de nueva generación, diseñada para ofrecer precisión y eficiencia en la confección de todo tipo de tejidos.", image: "https://via.placeholder.com/300x200", category: "Maquina", price: 300, brand: "marcaA" },
    { id: 5, title: "Fileteadora electronica Jontex", description: "La Fileteadora Electrónica Jontex es una máquina mecatrónica de overlock (fileteado) pensada para producción de telas medianas y ligeras, que combina alta velocidad, eficiencia energética y acabados profesionales.", image: "https://via.placeholder.com/300x200", category: "Maquina", price: 80, brand: "marcaB" },
    { id: 6, title: "Collarin electronica Jontex", description: "La Recubridora/Collarín Mecatrónica Jontex es una máquina de coser industrial especializada en puntada cadeneta tipo collarín y recubridor superior, ideal para bajos de prendas y acabados elásticos de alta calidad.", image: "https://via.placeholder.com/300x200", category: "Maquina", price: 120, brand: "marcaC" },
    { id: 7, title: "Plana electronica Jinthex", description: "La Plana Electrónica Jinthex es una máquina de pespunte de cama plana, de una sola aguja, diseñada para ofrecer un alto rendimiento en la confección de telas ligeras a medianas. ", image: "https://via.placeholder.com/300x200", category: "Maquina", price: 400, brand: "marcaA" },
    { id: 8, title: "Fileteadora electronica Jinthex", description: "La Fileteadora Mecatrónica Jinthex JN798 es una máquina overlock de 4 hilos con puntada de refuerzo, ideal para tejidos medianos y ligeros. Incorpora un sistema direct drive de alta velocidad que elimina correas y poleas, reduciendo ruido y vibraciones, y un motor ahorrador de 550 W.", image: "https://via.placeholder.com/300x200", category: "Maquina", price: 60, brand: "marcaB" },
    { id: 9, title: "Collarin electronica Jinthex", description: "La Recubridora/Collarín Mecatrónica JINTHEX JN‑500D (también conocida como JN‑500‑02D) es una máquina especializada en puntada cadeneta tipo collarín y recubridor superior, ideal para bajos de prendas y acabados elásticos de alta calidad. ", image: "https://via.placeholder.com/300x200", category: "Maquina", price: 220, brand: "marcaC" }
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