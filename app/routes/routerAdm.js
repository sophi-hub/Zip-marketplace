const express = require("express");
const router = express.Router();
const { verificarUsuAutorizado, limparSessao, verificarUsuAutenticado } = require("../auth/autentico");
const multer = require('multer');
const upload = multer({ dest: './app/public/IMG/uploads/' });
const admController = require("../controllers/admController");
const denunciaController = require("../controllers/denunciaController");
const controller = require("../controllers/controllers");


router.get("/tabelasAdm", function (req, res) {
  res.render('pages/tabelasAdm', { msg: 'Back-end funcionando' });
});

router.get("/adm",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null,

  },
    [3]
  ), function (req, res) {
    res.render("./pages/tabelasAdm", { page: "../partial/adm/index" })
  })

router.get("/adm-famosos",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [3]
  ), function (req, res) {
    admController.mostrarFamosos(req, res)
  })

  router.get('/adm-denuncias', 
    verificarUsuAutenticado,
    verificarUsuAutorizado(
        "./pages/login_do_usuario", {
            erros: null,
            dadosform: { email: "", senha: "" },
            logado: false,
            usuarioautenticado: null
        },
        [3]
    ),
    function (req, res){
    admController.mostrarDenuncias(req, res)
  })

  router.post('/removerDenuncia',   
    verificarUsuAutenticado,
    verificarUsuAutorizado(
      "./pages/login_do_usuario", {
      erros: null,
      dadosform: { email: "", senha: "" },
      logado: false,
      usuarioautenticado: null
    },
      [3]
    ), async (req, res) => {
    try {
        const { id_prod_cliente } = req.query;
        await admController.removerProdutoDenunciado(id_prod_cliente);
        res.redirect('/adm-denuncias');
    } catch (error) {
        console.error('Erro ao remover produto denunciado: ', error);
        res.status(500).send('Erro ao remover o produto denunciado.');
    }
});

router.post("/aprovarFamoso",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [3]
  )
  , function (req, res) {
    admController.aprovarFamoso(req, res)
  })

router.post("/negarFamoso",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [3]
  ), function (req, res) {
    admController.negarFamoso(req, res)
  })


module.exports = router;

