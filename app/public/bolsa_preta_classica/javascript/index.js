function addToCart(productName, price, img, id_prod_cliente) {
    console.log(id_prod_cliente);
    const cartItem = {
        name: productName,
        price: price,
        img: img,
        id_prod_cliente: id_prod_cliente

    };
    console.log(cartItem);
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}


