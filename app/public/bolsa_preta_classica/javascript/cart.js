/*document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});

function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('total-price');
    const otherTotalContainer1 = document.getElementById('other-total-price-1'); // Novo span para o preço total adicional
    const otherTotalContainer2 = document.getElementById('other-total-price-2'); // Novo span para o preço total adicional
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    console.log(cartItems);
    let totalPrice = 0;


    cartContainer.innerHTML = '';
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('artcile');
        cartItem.classList.add('cart-item');
        
        const productImage = document.createElement('img');
        productImage.src = `${item.img}`;
        productImage.alt = item.name;
        cartItem.appendChild(productImage);
        

        const productInfo = document.createElement('article');
        productInfo.innerHTML = `
        <h3 class="name-prod">${item.name}</h3>
        <p class="preco-prod">R$ ${Number(item.price).toFixed(2)}</p>
        <h1>
        <img id="coracao_mover"  src="../../IMG/sacola/produtos/coracao_escrito_mover_par_uma_lista_de_desejos.svg" alt="Descrição da Imagem">
        Mover para a wishlist
        </h1>`;
        cartItem.appendChild(productInfo);

        const additionalInfo = document.createElement('article');
        additionalInfo.id = `item-mercadopago`; // Adiciona um ID único, por exemplo, "item-0", "item-1", etc.
        console.log(item);
        additionalInfo.innerHTML = `
        <p>${item.name}</p>
        <p>${Number(item.price).toFixed(2)}</p>
        <p>${item.id_prod_cliente}</p>
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
*/
function removeFromCart(index) {
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
}
