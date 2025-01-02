const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.5) { // 50% do elemento visível
          if (entry.target.classList.contains('init-hidden--direita')) {
              entry.target.classList.add('animate__fadeInRight');
          } else if (entry.target.classList.contains('init-hidden')) {
              entry.target.classList.add('animate__fadeIn');
          }
      }
  });
}, {
  threshold: [0, 0.5, 1] // Ajustando o threshold para diferentes níveis de visibilidade
});

document.querySelectorAll('.init-hidden, .init-hidden--direita').forEach(element => {
  observer.observe(element);
});
