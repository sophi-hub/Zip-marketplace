document.addEventListener("DOMContentLoaded", function() {
    // Seleciona todos os elementos cujo id começa com "lordiconfv"
    var elements = document.querySelectorAll("[id^='lordiconfv']");
    
    // Itera sobre cada elemento encontrado
    elements.forEach(function(element) {
        // Adiciona o evento de clique a cada elemento
        element.addEventListener("click", function() {
            var currentSrc = this.getAttribute("src");
            var newSrc = currentSrc === "https://cdn.lordicon.com/xyboiuok.json" ?
                         "https://cdn.lordicon.com/ulnswmkk.json" :
                         "https://cdn.lordicon.com/xyboiuok.json";
            this.setAttribute("src", newSrc);
        });
    });
});
