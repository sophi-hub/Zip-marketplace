

function calcularTotal() {
    const precos = document.querySelectorAll('.preco-prod-value');
    let total = 0;

    precos.forEach(preco => {
        total += Number(preco.textContent); // Garantindo que o valor seja um número
    });

    const totalSpans = document.querySelectorAll('.other-total-price-1');
    totalSpans.forEach(totalSpan => {
        totalSpan.textContent = total.toFixed(2); // Formata para duas casas decimais
    });
}

calcularTotal();