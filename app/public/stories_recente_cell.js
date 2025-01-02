/*antigo
const carouselSlidest = document.querySelector('.carousel-slideST');
const slidesst = document.querySelectorAll('.slideST');
const paginationItemsst = document.querySelectorAll('.pagination-itemST');

let counter = 0;
const slideWidth = slidesst[0].clientWidth;

carouselSlidest.style.transform = `translateX(${-slideWidth * counter}px)`;

setInterval(() => {
    counter++;
    if (counter >= slidesst.length) {
        counter = 0;
    }
    carouselSlidest.style.transition = 'transform 0.5s ease-in-out';
    carouselSlidest.style.transform = `translateX(${-slideWidth * counter}px)`;

    paginationItemsst.forEach(item => {
        item.classList.remove('active2');
    });
    paginationItemsst[counter].classList.add('active2');
}, 3000);*/

const carouselSlide2 = document.querySelector('.carousel-slideST');
const slides2 = document.querySelectorAll('.slideST');
const paginationItems2 = document.querySelectorAll('.pagination-itemST');

let counter2 = 0;
const slideWidth2 = slides2[0].clientWidth;

carouselSlide2.style.transform = `translateX(${-slideWidth2 * counter2}px)`;

setInterval(() => {
    counter2++;
    if (counter2 >= slides2.length) {
        counter2 = 0;
    }
    carouselSlide2.style.transition = 'transform 0.5s ease-in-out';
    carouselSlide2.style.transform = `translateX(${-slideWidth2 * counter2}px)`;

    paginationItems2.forEach(item => {
        item.classList.remove('active2');
    });
    paginationItems2[counter2].classList.add('active2');
}, 3000);