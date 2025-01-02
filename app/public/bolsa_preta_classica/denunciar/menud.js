

document.getElementById("openMenuBt").addEventListener("click", function() {
    var menu = document.getElementById("men");
    var overlay = document.getElementById("overlay");
    if (menu.style.right === "0%") {
      menu.style.right = "-50%";
      overlay.classList.remove('overlay-active');
    } else {
      menu.style.right = "0%";
      overlay.classList.add('overlay-active');
    }
    ally.classList.toggle("background")
  });
  
  document.getElementById("closeMenuB").addEventListener("click", function() {
    var menu = document.getElementById("men");
    var overlay = document.getElementById("overlay");
    menu.style.right = "-50%";
    overlay.classList.remove('overlay-active');
    ally.classList.remove("background")
  });
  
  
  document.getElementById("closeMenu").addEventListener("click", function() {
    var menu = document.getElementById("men");
    var overlay = document.getElementById("overlay");
    menu.style.right = "-50%";
    overlay.classList.remove('overlay-active');
    ally.classList.remove("background")
  });
  




