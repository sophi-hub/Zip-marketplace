function handleClick() {
    var addButton = document.getElementById('produto_adicionar_a_categoria');

    addButton.textContent = 'ADICIONANDO...';
    addButton.disabled = true;

    setTimeout(function() {
        addButton.textContent = 'ADICIONADO';
        addButton.disabled = true;
        addButton.style.backgroundColor = '#5C5C5C'; // Nova cor do botão
        addButton.style.color = '#fff'; // Nova cor do texto
    }, 2000); // Tempo simulado de carga: 2 segundos
}
