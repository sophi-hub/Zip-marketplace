const videoContainer = document.querySelector('.container');
let lastScrollY = window.scrollY;
let scaleFactor = 1;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const isInFirstViewport = currentScrollY <= window.innerHeight; // Verifica se estamos na primeira janela

    if (currentScrollY > lastScrollY) {
        // Expandir o vídeo ao rolar para baixo
        scaleFactor = Math.min(scaleFactor + 0.5, 20);
    } else {
        // Não reduzir o vídeo ao rolar para cima, só ajustar quando voltar para a primeira janela
        if (isInFirstViewport) {
            scaleFactor = Math.max(scaleFactor - 0.5, 1);
        }
    }

    // Calcular as dimensões máximas com um espaçamento de 2vw das bordas da tela
    const maxWidth = window.innerWidth - 4 * (window.innerWidth / 100); // 100vw - 4vw
    const maxHeight = window.innerHeight - 4 * (window.innerHeight / 100); // 100vh - 4vh

    // Aplicar transformações à div do vídeo
    const newWidth = Math.min(300 * scaleFactor, maxWidth);
    const newHeight = Math.min(200 * scaleFactor, maxHeight);

    videoContainer.style.width = `${newWidth}px`;
    videoContainer.style.height = `${newHeight}px`;

    // Ajustar a posição para garantir que o vídeo não cubra o conteúdo subsequente
    if (currentScrollY > window.innerHeight) {
        // Expandido: permitir rolar por cima do conteúdo
        videoContainer.style.position = 'absolute';
        videoContainer.style.bottom = 'auto';
        videoContainer.style.left = 'auto';
        videoContainer.style.top = '0'; // Ajusta para fixar o topo
    } else {
        // Miniatura: manter o posicionamento fixo original
        videoContainer.style.position = 'fixed';
        videoContainer.style.bottom = '2vw';
        videoContainer.style.left = '2vw';
        videoContainer.style.top = 'auto';
    }

    lastScrollY = currentScrollY;
});
