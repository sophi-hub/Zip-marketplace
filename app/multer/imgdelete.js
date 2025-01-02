const fs = require("fs")

function removeImg(caminho) {
    fs.unlink(caminho, function (error) {
        if (error && error.code == "ENOENT") {
            console.log("Arquivo não existe, não foi possível apagar!");
            return false;
        } else if (error) {
            console.log("Erro ao tentar apagar o arquivo");
            console.log(error);
            return false;
        } else {
            return true;
        }
    });
}

module.exports = { removeImg }