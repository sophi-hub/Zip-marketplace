/*antigo
const carouselSlide = document.querySelector('.carousel-slide');
const slides = document.querySelectorAll('.slide');
const paginationItems = document.querySelectorAll('.pagination-item');

let counter = 0;
const slideWidth = slides[0].clientWidth;

carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;

setInterval(() => {
    counter++;
    if (counter >= slides.length) {
        counter = 0;
    }
    carouselSlide.style.transition = 'transform 0.2s ease-in-out';
    carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;

    paginationItems.forEach(item => {
        item.classList.remove('active');
    });
    paginationItems[counter].classList.add('active');
}, 2000);*/

const carouselSlide1 = document.querySelector('.carousel-slide');
const slides1 = document.querySelectorAll('.slide');
const paginationItems1 = document.querySelectorAll('.pagination-item');

let counter1 = 0;
const slideWidth1 = slides1[0].clientWidth;

carouselSlide1.style.transform = `translateX(${-slideWidth1 * counter1}px)`;

setInterval(() => {
    counter1++;
    if (counter1 >= slides1.length) {
        counter1 = 0;
    }
    carouselSlide1.style.transition = 'transform 0.2s ease-in-out';
    carouselSlide1.style.transform = `translateX(${-slideWidth1 * counter1}px)`;

    paginationItems1.forEach(item => {
        item.classList.remove('active');
    });
    paginationItems1[counter1].classList.add('active');
}, 2000);
