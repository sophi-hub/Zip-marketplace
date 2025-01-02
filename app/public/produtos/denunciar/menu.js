const ally = document.getElementById("ally");

// Abrir D.produto
document.getElementById("openMenuBtn").addEventListener("click", function () {
    var menu = document.getElementById("menu");
    var overlay = document.getElementById("overlay");

    menu.style.right = "0";
    overlay.style.display = "block";
    ally.classList.add("background");
});

// Fechar D.produto
["closeMenuBtn", "closeMenuBt"].forEach(function (Feh) {
  document.getElementById(Feh).addEventListener("click", function () {
    var menu = document.getElementById("menu");
    var overlay = document.getElementById("overlay");

    menu.style.right = "-100%";
    overlay.style.display = "none";
    ally.classList.remove("background");
  });
});

// Abrir D.vendedor
document.getElementById("openMenuBt").addEventListener("click", function () {
    var menu = document.getElementById("men");
    var overlay = document.getElementById("overlay");

    menu.style.right = "0";
    overlay.style.display = "block";
    ally.classList.add("background");
});

// Fecha D.vendedor
["closeMenuB", "closeMenu"].forEach(function (Feh) {
  document.getElementById(Feh).addEventListener("click", function () {
    var menu = document.getElementById("men");
    var overlay = document.getElementById("overlay");

    menu.style.right = "-100%";
    overlay.style.display = "none";
    ally.classList.remove("background");
  });
});


// Fecha no clique do overlas
document.getElementById("overlay").addEventListener("click", function () {
    var menu1 = document.getElementById("menu");
    var menu2 = document.getElementById("men");
    var overlay = document.getElementById("overlay");

    menu1.style.right = "-100%";
    menu2.style.right = "-100%";
    overlay.style.display = "none";
    ally.classList.remove("background");
});
