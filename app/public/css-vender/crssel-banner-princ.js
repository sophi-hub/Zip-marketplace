var swiper = new Swiper(".mySwiper", {
    direction: "vertical",
    slidesPerView: 1,
    mousewheel: true,
    effect: "creative",
    creativeEffect: {
      prev: {
        shadow: true,
        translate: [-400, -400, -400],
      },
      next: {
        translate: [0, "100%", 0],
      },
    },
});