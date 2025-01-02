function removeProductFromCartfv(cartItem) {
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const newCartItems = cartItems.filter(function(item) {
        return item.imagefv != cartItem.imagefv;
    })

    
    localStorage.setItem('cartItemsfv', JSON.stringify(newCartItems));
}

function productExistInCart(cartItem) {
    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // não tem productos no carrinho
    if (cartItems.length === 0) return false;

    // valida se o produto selecionado está no carrinho
    const isProductInCart = cartItems.some(function(item) {
        return item.imagefv == cartItem.imagefv;
    })

    return isProductInCart
} 


function addToCartfv(productName, price, imageName, description) {
    const cartItem = {
        name: productName,
        price: price,
        imagefv: imageName,
        descriptionfv: description
    };

    if (productExistInCart(cartItem)) {
        removeProductFromCartfv(cartItem);
        return
    };    
    

    let cartItems = localStorage.getItem('cartItemsfv');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.push(cartItem);
    localStorage.setItem('cartItemsfv', JSON.stringify(cartItems));
}


window.addEventListener("load", function() {
    
// validar se tem produtos na lista de desejo
let cartItems = localStorage.getItem('cartItemsfv');
cartItems = cartItems ? JSON.parse(cartItems) : [];

// não tem productos no carrinho
if (cartItems.length === 0) return;

// comparar a image dos protudos na tela com o que tem na lista de desejo
cartItems.forEach(function(cardItem) {
    let imagefv = '[data-image="' + cardItem.imagefv + '"]'; // [data-image="IMAGE"]
    let img = this.document.querySelector(imagefv);

    if(img) {
        img.src = "https://cdn.lordicon.com/ulnswmkk.json"
    }
});

})