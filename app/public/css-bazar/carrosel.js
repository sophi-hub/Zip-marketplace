// primeiro ele pega todos os cards que tenham a classe .card, e seta o indexAtual que é 0, ou seja, começa pelo primeiro do array
const carouselsContainers = document.querySelectorAll(".carousel__container")

carouselsContainers.forEach(container => {
    
    const cards = container.querySelectorAll(".card")
    const previous = container.querySelector(".previous")
    const next = container.querySelector(".next")
    let indexAtual = 0;
    const atualizarCard = (arrayCard) => {
        arrayCard.forEach((card, indexCard) => {
            card.style.transform = `translateX(-${indexAtual * 108}%)`;
            if (indexCard === indexAtual) {
                card.classList.add("active")
            } else {
                card.classList.remove("active")
            }
        })
    }

    previous.addEventListener('click', () => {
        indexAtual = (indexAtual - 1 + cards.length) % cards.length;
        atualizarCard(cards);
    });
    next.addEventListener('click', () => {
        indexAtual = (indexAtual + 1) % cards.length;
        atualizarCard(cards);
    });

    atualizarCard(cards)
})

