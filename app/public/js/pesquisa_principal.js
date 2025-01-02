/*
    const searchIcon = document.getElementById('searchIcon_principal');
    const searchInput = document.getElementById('searchInput_principal');
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
    }

*/