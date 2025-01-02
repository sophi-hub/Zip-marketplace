const {  ValidationResult  } = require("express-validator");
const usuario = require("../models/models");
const bcrypt = require("bcrypt")

verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null};
    }
    req.session.autenticado = autenticado;
    next();
}

limparSessao = (req, res, next) => {
    req.session.destroy();
    next()
}

gravarUsuAutenticado = async (req, res, next) => {
    erros = validationResult(req)
    if (erros.isEmpty()) {
        var dadosForm = {
            email: req.body.email,
            senha: req.body.senha,
        };
        var results = await usuario.findUserEmail(dadosForm.email);
        var total = Object.keys(results).length;
        if (total == 1) {
            if (bcrypt.compareSync(dadosForm.senha, results[0].senha)) {
                var autenticado = {
                    autenticado: results[0].nome,
                    id: results[0].id_Cliente,
                    tipo:results[0].tipousuario
                };
            }
        } else {
            var autenticado = { autenticado: null, id: null, tipo: null} ;;
        }
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null} ;;
    }
    console.log(autenticado);
    req.session.autenticado = autenticado;
}
verificarUsuAutorizado = (destinoFalha, objectJson ,tipoPermitido = null) => {
    return (req, res, next) => {
        
        if (req.session.autenticado.autenticado != null && tipoPermitido.find(function (element) { 
            return element == req.session.autenticado.tipo 
        }) != undefined) {
        next();
        } else {
            if(req.session.autenticado && req.session.autenticado.autenticado != null){
                return   res.redirect("/")
            }
         return   res.render(destinoFalha, objectJson);
        }
    };
}

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}