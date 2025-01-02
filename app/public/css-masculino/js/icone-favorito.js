/*
document.addEventListener("DOMContentLoaded", function() {
    // Seleciona todos os elementos cujo id começa com "lordiconfv"
    var elements = document.querySelectorAll("[id^='lordiconfv']");

    // Itera sobre cada elemento encontrado
    elements.forEach(async function(element) {
        var idProd = element.dataset.id; // Supondo que o ID do produto esteja no atributo data-id
        var currentSrc = element.getAttribute("src");
        
        // Faz a requisição ao servidor para verificar se o produto já está nos favoritos
        try {
            let response = await fetch('/checkFavStatus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idProd: idProd })
            });
            
            let data = await response.json();
            console.log('favoritado: ',data.prodFavJaExiste);


            
            
            if (data.prodFavJaExiste) {
                console.log("favoritado sim");
                
                element.setAttribute("src", "https://cdn.lordicon.com/xyboiuok.json"); // Produto ainda não favoritado
            } else {
                console.log("favoritado não");
                element.setAttribute("src", "https://cdn.lordicon.com/ulnswmkk.json"); // Produto já favoritado
            }
        } catch (error) {
            console.error('Erro ao verificar status do favorito:', error);
        }

        // Adiciona o evento de clique a cada elemento
        element.addEventListener("click", async function() {
            var idProd = this.dataset.id; // Supondo que o ID do produto esteja no atributo data-id
            var currentSrc = this.getAttribute("src");
            
            // Faz a requisição ao servidor para verificar se o produto já está nos favoritos
            try {
                let response = await fetch('/checkFavStatus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idProd: idProd })
                });
                
                let data = await response.json();
                console.log(data.prodFavJaExiste);
                
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


*/