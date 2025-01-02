/*barra de pesquisa*/
window.addEventListener('scroll', function() {
    var icon1 = document.getElementById('icon1_principal');
    var icon2 = document.getElementById('icon2_principal');
    
    if (window.scrollY > -10) {
        icon1.style.display = 'block';
        icon2.style.display = 'none';
    }
});

/*favorito*/
window.addEventListener('scroll', function() {
    var icon1 = document.getElementById('lordicon');
    var icon2 = document.getElementById('lordicon2');
    
    if (window.scrollY > 0) {
        icon1.style.display = 'block';
        icon2.style.display = 'none';
    }
});
/*
/*pessoa*/
window.addEventListener('scroll', function() {
    var icon1 = document.getElementById('pessoa2');
    var icon2 = document.getElementById('pessoa1');
    
    if (window.scrollY > 0) {
        icon1.style.display = 'block';
        icon2.style.display = 'none';
    }
});

/*sacola*/ 
window.addEventListener('scroll', function() {
    var icon1 = document.getElementById('sacola1');
    var icon2 = document.getElementById('sacola2');
    
    if (window.scrollY > 0) {
        icon1.style.display = 'block';
        icon2.style.display = 'none';
    } 
});
