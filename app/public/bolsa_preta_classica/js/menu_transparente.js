document.getElementById("openMenuBtnn").addEventListener("click", function() {
    var blackDiv = document.getElementById('blackDiv');
    var menu = document.getElementById("menu");
    var openMenuBtn = document.getElementById("openMenuBtn");
  
    if (menu.style.right === "0%") {
        menu.style.right = "-68%";
        blackDiv.style.display = 'none'; // Esconde a div preta
        openMenuBtn.classList.remove('active');
    } else {
        menu.style.right = "0%";
        blackDiv.style.display = 'block'; // Mostra a div preta
        openMenuBtn.classList.add('active');
    }
  });
  
  // Outro código para fechar o menu
  document.getElementById("closeMenuBtnn").addEventListener("click", function() {
    var blackDiv = document.getElementById('blackDiv');
    var menu = document.getElementById("menu");
    var openMenuBtn = document.getElementById("openMenuBtnn");
  
    menu.style.right = "-68%";
    blackDiv.style.display = 'none'; // Esconde a div preta
    openMenuBtn.classList.remove('active');
  });
  