document.addEventListener("DOMContentLoaded", function() {
  function initializeSwiper() {
    if (window.matchMedia("(max-width: 750px)").matches) {
      var swiper = new Swiper(".mySwiper", {
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true,
        },
      });
      return swiper;
    }
  }

  let swiperInstance;

  // Inicializar o Swiper na carga inicial
  swiperInstance = initializeSwiper();

  // Adicionar listener para redimensionamento da janela
  window.addEventListener("resize", function() {
    if (swiperInstance) {
      // Se já houver uma instância do Swiper, não faça nada
      return;
    }
    swiperInstance = initializeSwiper();
  });
});
