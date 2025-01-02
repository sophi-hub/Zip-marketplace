/*const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');
let isSearchActive = false;

// Mostrar a barra de pesquisa quando o mouse está sobre o botão ou sobre a barra de pesquisa
searchIcon.addEventListener('mouseenter', showSearch);
searchInput.addEventListener('mouseenter', showSearch);

// Esconder a barra de pesquisa quando o mouse sai do botão ou da barra de pesquisa
searchIcon.addEventListener('mouseleave', hideSearch);
searchInput.addEventListener('mouseleave', hideSearch);

// Ativar a barra de pesquisa quando clicar no botão ou na barra de pesquisa
searchIcon.addEventListener('click', activateSearch);
searchInput.addEventListener('click', activateSearch);

// Esconder a barra de pesquisa quando clicar fora do botão ou da barra de pesquisa
document.addEventListener('click', function(event) {
  const isClickInsideSearchContainer = searchIcon.contains(event.target) || searchInput.contains(event.target);
  
  if (!isClickInsideSearchContainer) {
    searchInput.classList.remove('show');
    isSearchActive = false;
  }
});

function showSearch() {
  searchInput.classList.add('show');
}

function hideSearch() {
  if (!isSearchActive) {
    searchInput.classList.remove('show');
  }
}

function activateSearch() {
  isSearchActive = true;
}*/

// Módulo 1
const searchIconPrincipal = document.getElementById('searchIcon_principal');
const searchInputPrincipal = document.getElementById('searchInput_principal');
let isSearchActivePrincipal = false;

searchIconPrincipal.addEventListener('mouseenter', showSearchPrincipal);
searchInputPrincipal.addEventListener('mouseenter', showSearchPrincipal);
searchIconPrincipal.addEventListener('mouseleave', hideSearchPrincipal);
searchInputPrincipal.addEventListener('mouseleave', hideSearchPrincipal);
searchIconPrincipal.addEventListener('click', activateSearchPrincipal);
searchInputPrincipal.addEventListener('click', activateSearchPrincipal);

document.addEventListener('click', function(event) {
    const isClickInsideSearchContainer = searchIconPrincipal.contains(event.target) || searchInputPrincipal.contains(event.target);
    
    if (!isClickInsideSearchContainer) {
        searchInputPrincipal.classList.remove('show');
        isSearchActivePrincipal = false;
    }
});

function showSearchPrincipal() {
    searchInputPrincipal.classList.add('show');
}

function hideSearchPrincipal() {
    if (!isSearchActivePrincipal) {
        searchInputPrincipal.classList.remove('show');
    }
}

function activateSearchPrincipal() {
    isSearchActivePrincipal = true;
}

// Módulo 2
const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');
let isSearchActive = false;

searchIcon.addEventListener('mouseenter', showSearch);
searchInput.addEventListener('mouseenter', showSearch);
searchIcon.addEventListener('mouseleave', hideSearch);
searchInput.addEventListener('mouseleave', hideSearch);
searchIcon.addEventListener('click', activateSearch);
searchInput.addEventListener('click', activateSearch);

document.addEventListener('click', function(event) {
    const isClickInsideSearchContainer = searchIcon.contains(event.target) || searchInput.contains(event.target);
    
    if (!isClickInsideSearchContainer) {
        searchInput.classList.remove('show');
        isSearchActive = false;
    }
});

function showSearch() {
    searchInput.classList.add('show');
}

function hideSearch() {
    if (!isSearchActive) {
        searchInput.classList.remove('show');
    }
}

function activateSearch() {
    isSearchActive = true;
}
