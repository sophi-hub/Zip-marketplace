document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener("change", function(event) {
      var files = event.target.files;
      var label = this.parentElement;
      var preview = label.querySelector(".preview");
      preview.innerHTML = "";
  
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var fileType = file.type.split("/")[0]; // Verifica se é uma imagem ou um vídeo
  
        if (fileType === "image") {
          var img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          preview.appendChild(img);
        } else if (fileType === "video") {
          var video = document.createElement("video");
          video.src = URL.createObjectURL(file);
          video.controls = true;
          preview.appendChild(video);
        }
      }
  
      // Adicionando a classe 'file-added' para ocultar a borda cinza
      label.classList.add("file-added");
    });
  });
  
  // Adicionando um ouvinte de eventos para o clique no retângulo
  document.querySelectorAll('.upload-area').forEach((area) => {
    area.addEventListener("click", function() {
      this.previousElementSibling.click(); // Clique no campo de entrada de arquivo associado
    });
  });
  