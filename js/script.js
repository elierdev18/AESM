// Espera a que el contenido del DOM se cargue completamente
document.addEventListener('DOMContentLoaded', function() {
    // Ejemplo de animación: Transición de opacidad en el banner
    const banner = document.querySelector('.banner');
    if (banner) {
      banner.style.opacity = 0;
      setTimeout(() => {
        banner.style.transition = "opacity 2s";
        banner.style.opacity = 1;
      }, 500);
    }
    
    // Ejemplo de interacción: Al hacer clic en un producto, muestra un mensaje
    const productos = document.querySelectorAll('.producto');
    productos.forEach(producto => {
      producto.addEventListener('click', function() {
        alert("¡Gracias por interesarte en este producto!");
      });
    });
  });
  