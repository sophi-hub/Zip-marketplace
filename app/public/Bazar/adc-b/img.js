document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Pega o arquivo selecionado

    if (file) {
        const reader = new FileReader(); // Cria um FileReader para ler o arquivo

        reader.onload = function(e) {
            const imagePreview = document.getElementById('imagePreview');
            const placeholder = document.getElementById('imagePlaceholder');

            imagePreview.src = e.target.result; // Define a imagem carregada como src
            imagePreview.style.display = 'block'; // Mostra a imagem
            placeholder.style.display = 'none'; // Esconde o "+"

        };

        reader.readAsDataURL(file); // Lê o arquivo como DataURL
    }
});


