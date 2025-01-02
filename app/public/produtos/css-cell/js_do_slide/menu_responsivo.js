document.getElementById("openMenuBtn2").addEventListener("click", function() {
    var blackDiv = document.getElementById('blackDiv');
    var menu = document.getElementById("menu2");
    var openMenuBtn = document.getElementById("openMenuBtn2");
  
    if (menu.style.right === "0%") {
        menu.style.right = "-78%";
        blackDiv.style.display = 'none'; // Esconde a div preta
        openMenuBtn.classList.remove('active');
    } else {
        menu.style.right = "0%";
        blackDiv.style.display = 'block'; // Mostra a div preta
        openMenuBtn.classList.add('active');
    }
  });
  
  // Outro código para fechar o menu
  document.getElementById("closeMenuBtn2").addEventListener("click", function() {
    var blackDiv = document.getElementById('blackDiv');
    var menu = document.getElementById("menu2");
    var openMenuBtn = document.getElementById("openMenuBtn2");
  
    menu.style.right = "-78%";
    blackDiv.style.display = 'none'; // Esconde a div preta
    openMenuBtn.classList.remove('active');
  });
  