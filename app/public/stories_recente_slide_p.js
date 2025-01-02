
let slides = document.querySelectorAll('.slide3st');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active3st');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active3st');
}

setInterval(nextSlide, 3000);