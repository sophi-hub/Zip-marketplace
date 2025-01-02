// Adiciona um evento de escuta para o evento 'input' no campo de texto
document.getElementById("cep").addEventListener("input", function() {
    var cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length === 8) { // Verifica se o CEP possui 8 dígitos
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            var enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
            document.getElementById("cep").value = enderecoCompleto;
          } else {
            document.getElementById("cep").value = "CEP não encontrado.";
          }
        })
        .catch(error => console.log("Erro ao buscar endereço:", error));
    }
  });
  