// Função para gerar o QR Code
function generateQRCode() {
  var generateBtn = document.getElementById('generate-btn');
  generateBtn.innerText = 'GERANDO';

  setTimeout(function() {
      var qrCodeDiv = document.getElementById('qr-code');
      var qrCodeTextDiv = document.getElementById('qr-code-text');
      qrCodeDiv.innerHTML = ''; // Limpa o conteúdo anterior
      qrCodeTextDiv.innerHTML = ''; // Limpa o conteúdo anterior

      var text = generateRandomText();

      new QRCode(qrCodeDiv, {
          text: text,
          width: 100,
          height: 100
      });
      qrCodeTextDiv.innerText = text;

      generateBtn.innerText = 'PIX GERADO';
  }, 2000); // Tempo de simulação de geração do QR Code (2 segundos)

}

// Função para gerar texto aleatório
function generateRandomText() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Gerar o QR Code inicial
document.getElementById('generate-btn').innerText = 'GERAR PIX';

// Evento para gerar o QR Code quando o botão for clicado
document.getElementById('generate-btn').addEventListener('click', function() {
  generateQRCode();
});
