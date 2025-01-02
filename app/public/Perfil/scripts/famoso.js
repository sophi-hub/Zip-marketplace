document.getElementById('famous').addEventListener('click', function() {
    const fundo = document.getElementById('motag');
    fundo.style.display = 'flex';
    setTimeout(() => {
        fundo.classList.add('show');
    }, 10);
});

document.getElementById('fecharFormulario').addEventListener('click', function() {
    const fundo = document.getElementById('motag');
    fundo.classList.remove('show');
    setTimeout(() => {
        fundo.style.display = 'none';
    }, 300);
});
