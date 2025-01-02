document.addEventListener("DOMContentLoaded", function() {
    // Seleciona todos os elementos com a classe "add-to-cartfv"
    var elements = document.querySelectorAll(".add-to-cartfv");

    // Itera sobre cada elemento encontrado
    elements.forEach(function(element) {
        // Adiciona o evento de clique a cada elemento
        element.addEventListener("click", async function(event) {
            event.preventDefault(); // Impede o envio do formulário antes de verificar o status

            var idProd = this.closest('form').querySelector('input[name="idProd"]').value; // Obtém o idProd do formulário
            var currentSrc = this.getAttribute("src");
            
            // Faz a requisição ao servidor para verificar se o produto já está nos favoritos
            try {
                let response = await fetch('/checkFavStatus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idProd: idProd })
                });
                
                let data = await response.json();
                
                if (data.prodFavJaExiste) {
                    this.setAttribute("src", "https://cdn.lordicon.com/ulnswmkk.json"); // Produto já favoritado
                } else {
                    this.setAttribute("src", "https://cdn.lordicon.com/xyboiuok.json"); // Produto ainda não favoritado
                }
            } catch (error) {
                console.error('Erro ao verificar status do favorito:', error);
            }
        });
    });
});
