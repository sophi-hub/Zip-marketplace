document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});

function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('total-price');
    const otherTotalContainer1 = document.getElementById('other-total-price-1'); // Novo span para o preço total adicional
    const otherTotalContainer2 = document.getElementById('other-total-price-2'); // Novo span para o preço total adicional
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    let totalPrice = 0;

    cartContainer.innerHTML = '';
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        const productImage = document.createElement('img');
        productImage.src = '../../IMG/sacola/produtos/bolsa.png';
        productImage.alt = item.name;
        cartItem.appendChild(productImage);
        
        const productInfo = document.createElement('div');
        productInfo.innerHTML = `<h3>BOLSA PRETA CLÁSSICA</h3><h2>${item.name}</h2><p>R$ ${item.price.toFixed(2)}</p>
        <p id="cor_preta">Cor: Preta </p>
        <h1>
        <img id="coracao_mover"  src="../../IMG/sacola/produtos/coracao_escrito_mover_par_uma_lista_de_desejos.svg" alt="Descrição da Imagem">
        Mover para a wishlist
    </h1> `;
        cartItem.appendChild(productInfo);
        const additionalInfo = document.createElement('div');
        additionalInfo.innerHTML = `
        <p>${item.name}</p>
        <p>${item.price.toFixed(2)}</p>
        <p>${item.id_prod_cliente}</p>☻
  

        `;

        cartItem.appendChild(additionalInfo); // Adicione esta linha aqui
        
        const removeButton = document.createElement('button');
        removeButton.textContent = '';
        removeButton.onclick = function() {
            removeFromCart(index);
        };
        cartItem.appendChild(removeButton);
        
        cartContainer.appendChild(cartItem);
        totalPrice += parseFloat(item.price);
    });

    totalContainer.textContent = totalPrice.toFixed(2);
    otherTotalContainer1.textContent = totalPrice.toFixed(2); // Exibir o preço total em outro span
    otherTotalContainer2.textContent = totalPrice.toFixed(2); // Exibir o preço total em outro span
}

function removeFromCart(index) {
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
}
