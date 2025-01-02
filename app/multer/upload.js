const multer = require("multer");
const path = require("path");

const createFileFilter = (extensoesPermitidas) => {
    return (req, file, cowboy) => {
        const extensoesRegex = new RegExp(extensoesPermitidas.join('|'));
        const extname = extensoesRegex.test(path.extname(file.originalname).toLowerCase());
        const mimetype = extensoesRegex.test(file.mimetype);

        if (extname && mimetype) {
            return cowboy(null, true);
        } else {
            return cowboy(new Error("Tipo de arquivo inválido"));
        }
    };
};

module.exports = (caminho = null, tamanhoArq = 3, extensoesPermitidas = ['jpeg', 'jpg', 'png', 'webp']) => {
    return (campoArquivo) => {
        return (req, res, next) => {
            var upload;
            const fileFilter = createFileFilter(extensoesPermitidas);
            if (caminho == null) {
                // Caso de armazenamento em SGBD (não modificado)
                const storage = multer.memoryStorage();
                upload = multer({
                    storage: storage,
                    limits: { fileSize: tamanhoArq * 1024 * 1024 },
                });
            } else {
                // Versão em diretório (pasta)
                var storagePasta = multer.diskStorage({
                    destination: (req, file, cowboy) => {
                        cowboy(null, caminho); // Define a pasta de destino
                    },
                    filename: (req, file, cowboy) => {
                        // Gerar o nome do arquivo sem extensão
                        const nomeArquivo = file.fieldname + "-" + Date.now();
                        req.filePath = path.join(caminho, nomeArquivo); // Salva o caminho completo do arquivo sem extensão
                        cowboy(null, nomeArquivo); // Define o nome do arquivo sem a extensão
                    }
                });

                // Upload configurado para diretório
                upload = multer({
                    storage: storagePasta,
                    limits: { fileSize: tamanhoArq * 1024 * 1024 },
                    fileFilter: fileFilter
                });
            }

            req.session.erroMulter = null;

            upload.single(campoArquivo)(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    req.session.erroMulter = {
                        value: '',
                        msg: err.message,
                        path: campoArquivo
                    };
                } else if (err) {
                    req.session.erroMulter = {
                        value: '',
                        msg: err.message,
                        path: campoArquivo
                    };
                    console.log(req.session.erroMulter);
                } else if (req.file && caminho) {
                    req.filePath = path.join(caminho, req.file.filename); // Pega apenas o caminho do arquivo sem extensão
                    console.log("Caminho da imagem salva:", req.filePath);
                }
                next();
            });
        };
    };
};
