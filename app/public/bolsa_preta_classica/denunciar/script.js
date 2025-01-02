document.getElementById("denunciarBtn").addEventListener("click", function() {
    // Mostra "Denunciando" no botão
    document.getElementById("denunciarBtn").innerText = "Denunciando...";
  
    // Simula uma denúncia sendo feita (tempo de espera de 2 segundos)
    setTimeout(function() {
      // Após 2 segundos, mostra a mensagem de sucesso e altera o texto do botão
      document.getElementById("mensagem").innerText = "Sua denúncia foi realizada com sucesso.";
      document.getElementById("mensagem").style.display = "block";
      document.getElementById("denunciarBtn").innerText = "Denunciado";
    }, 2000);
  });
  

  document.getElementById("denunciarBt").addEventListener("click", function() {
    // Mostra "Denunciando" no botão
    document.getElementById("denunciarBt").innerText = "Denunciando...";
  
    // Simula uma denúncia sendo feita (tempo de espera de 2 segundos)
    setTimeout(function() {
      // Após 2 segundos, mostra a mensagem de sucesso e altera o texto do botão
      document.getElementById("mensage").innerText = "Sua denúncia foi realizada com sucesso.";
      document.getElementById("mensage").style.display = "block";
      document.getElementById("denunciarBt").innerText = "Denunciado";
    }, 2000);
  });
  