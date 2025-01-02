const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers");
const { validationResult } = require("express-validator");
const connection = require("../../config/pool_conexoes")
const bcrypt = require("bcrypt");
const { verificarUsuAutorizado, limparSessao, verificarUsuAutenticado } = require("../auth/autentico");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");

//sacola
const cartModels = require('../models/cartModels')

// PEDIDO
const pedidoControler = require("../controllers/pedidoControler")
const pedidoModel = require("../models/pedidoModel")
//MINHAS VENDAS
const minhasvendasModels = require('../models/minhasvendasModels') 

//Upload
const upl = require("../multer/upload")
const del = require("../multer/imgdelete")

var uplImg = upl("./app/public/IMG/uploads/")

const bazarController = require("../controllers/bazarController");
const denunciaController = require("../controllers/denunciaController");
const multer = require('multer');
const upload = multer({ dest: './app/public/IMG/uploads/' });
const denunciasModels = require("../models/denunciasModels");

// SDK do Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { pedidoController } = require("../controllers/pedidoControler");
const prodModels = require("../models/produtos.models");
// Adicione as credenciais
const client = new MercadoPagoConfig({
accessToken: process.env.accessToken
});

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const https = require("https");
const jwt = require("jsonwebtoken");
const { enviarEmail } = require("../util/email");

const emailAtivarConta = require("../util/email-ativar-conta");



function selecionarProdutosAleatorios(produtos, quantidade) {
  for (let i = produtos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [produtos[i], produtos[j]] = [produtos[j], produtos[i]];
  }
  return produtos.slice(0, quantidade);
}


router.get("/", verificarUsuAutenticado, async function (req, res) {
  try{
    const userId = req.session.autenticado.id;
    const [random] = await connection.query('SELECT * FROM produtos WHERE Stats = "Disponível"');
    const produtosAleatorios = selecionarProdutosAleatorios(random, 24);

    const bloco1 = produtosAleatorios.slice(0, 1);
    const bloco2 = produtosAleatorios.slice(1, 2);
    const bloco3 = produtosAleatorios.slice(2, 3);
    const bloco4 = produtosAleatorios.slice(3, 4);
    const bloco5 = produtosAleatorios.slice(4, 5);
    const bloco6 = produtosAleatorios.slice(5, 6);
    const bloco7 = produtosAleatorios.slice(6, 7);
    const bloco8 = produtosAleatorios.slice(7, 8);
    const bloco9 = produtosAleatorios.slice(8, 9);
    const bloco10 = produtosAleatorios.slice(9, 10);
    const bloco11 = produtosAleatorios.slice(10, 11);
    const bloco12 = produtosAleatorios.slice(11, 12);

    res.render('pages/index', { 
      bloco1, 
      bloco2, 
      bloco3, 
      bloco4,
      bloco5,
      bloco6,
      bloco7,
      bloco8,
      bloco9,
      bloco10,
      bloco11,
      bloco12,
      logado: false, 
      user: userId,
      usuarioautenticado: null, 
      dadosNotificacao: null });
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao conectar ao banco de dados, Max Users');
    }
});

router.get("/bazar", bazarController.getBazaarsWithProducts, function (req, res) {
  
});


router.get("/cadastro", function (req, res) {
  res.render('pages/cadastro',
    { erros: null, dadosNotificacao: null, dadosform: { nome: '', cpf: '', dia: '', mes: '', ano: '', email: '', senha: '', confirmsenha: '', cep: '' }, logado: false, usuarioautenticado: req.session.userid });
});

router.get("/login_do_usuario", verificarUsuAutenticado, async function (req, res) {
  if (req.session.autenticado && req.session.autenticado.id != null) {
    return res.redirect("/perfil")
  }
  res.render('pages/login_do_usuario', { dadosNotificacao: null, erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: req.session.userid });
});

router.get("/perfil",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    const user = await models.findUserById(req.session.autenticado.id);
    const userId = req.session.autenticado.id;
    const quantidadeVendas = await pedidoModel.contarVendasPorCliente(userId);

    const [random] = await connection.query('SELECT * FROM produtos WHERE Stats = "Disponível"');
    const produtosAleatorios = selecionarProdutosAleatorios(random, 4);

    const totalVendasNaoEnviadas = await pedidoModel.contarVendasNaoEnviadas(userId);

    const totalDenuncias = await denunciasModels.contarDenunciasUsu(userId);

    const bazar = await produtosModels.findBazarByUserId(userId);
    res.render('pages/perfil', { usuario: user, Bazar: bazar, totalVendasNaoEnviadas: totalVendasNaoEnviadas, random: produtosAleatorios, totalDenuncias: totalDenuncias, quantidadeVendas, dadosNotificacao: null, listaErros: null });
  }
);

router.post("/socialmedia",
  controller.regrasValidaçãoURL,
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1]),
  async function (req, res) {
    const erros = validationResult(req);
    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    const quantidadeVendas = await pedidoModel.contarVendasPorCliente(userId);
    const { socialLinks } = req.body;
    const user = await models.findUserById(userId);

    const [random] = await connection.query('SELECT * FROM produtos WHERE Stats = "Disponível"');
    const produtosAleatorios = selecionarProdutosAleatorios(random, 4);

    const totalVendasNaoEnviadas = await pedidoModel.contarVendasNaoEnviadas(userId);

    const totalDenuncias = await denunciasModels.contarDenunciasUsu(userId);

    if (!erros.isEmpty()) {
      return res.render("pages/perfil", {
        usuario: user,
        Bazar: bazar,
        quantidadeVendas,
        listaErros: erros,
        dadosNotificacao: null,
        listaProdBazar: [],
        random: produtosAleatorios,
        totalVendasNaoEnviadas: totalVendasNaoEnviadas,
        totalDenuncias: totalDenuncias,
        valores: {
          socialLinks: req.body.socialLinks,
        }
      });
    }

    await connection.query("UPDATE cliente SET Url_site = ? WHERE id_Cliente = ?;", [socialLinks, userId]);
    
    const userAtualizado = await models.findUserById(userId);

    res.render('pages/perfil', {
      erros: null,
      logado: true,
      usuarioautenticado: userId,
      usuario: userAtualizado,
      Bazar: bazar,
      quantidadeVendas,
      listaErros: null,
      random: produtosAleatorios,
      totalDenuncias: totalDenuncias,
      totalVendasNaoEnviadas: totalVendasNaoEnviadas,
      dadosNotificacao: { 
        title: "Solicitação Enviada", 
        msg: "Solicitação enviada com sucesso", 
        type: 'success' 
    },
    });
  }
);

router.get("/cart",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {

    const userId = req.session.autenticado.id;
    const user = await models.findUserById(userId);
    const cart = await cartModels.findAllProductByUserId(userId);
    
    const [random] = await connection.query('SELECT * FROM produtos WHERE Stats = "Disponível"');
    const produtosAleatorios = selecionarProdutosAleatorios(random, 4);

    const [userAddress] = await connection.query(
      "SELECT cep, casa FROM cliente WHERE id_Cliente = ?", [userId]
    );

    const valores = {
      cep: userAddress[0]?.cep || '',  
      numero: userAddress[0]?.casa || ''
    };
    
    res.render('pages/cart', { usuario: user, random: produtosAleatorios, dadosNotificacao: null, listaErros: null, cart: cart, erros: null, valores: valores });
  });

  router.get("/produtos-adicionados",
    verificarUsuAutenticado,
    verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
    async function (req, res) {
      const userId = req.session.autenticado.id;
      
      const prodAdd = await produtosModels.findAllProductByUserId(userId);

      res.render('pages/produtos-adicionados', { msg: 'Back-end funcionando', prodAdd: prodAdd });
    });

    router.post("/removeProdAdd",
      verificarUsuAutenticado,
      verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
      async function (req, res) {
  
        try {
        
          
          const productId = req.body.productAddremove; // Captura o valor do input
    
          
         
          console.log('ID do produto:', productId)
          const userId = req.session.autenticado.id;
          console.log( userId, productId);
          


           await connection.query(
            "DELETE FROM `produtos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
            [userId, productId]
          );
          await connection.query(
            "DELETE FROM `Favoritos` WHERE Id_prod_cliente = ?",
            [productId]
          );
          await connection.query(
            "DELETE FROM `Sacola` WHERE Id_prod_cliente = ?",
            [productId]
            );
          console.log('produto do add removido');
    
          res.redirect('/produtos-adicionados'); 
        } catch (err) {
          console.log(err);
          res.status(500).send('Erro ao remover produto adicionado'); // Opcional: resposta de erro
        }
        
      }
      );
  
  

  router.post("/removeCart",
    verificarUsuAutenticado,
    verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
    async function (req, res) {


      try {
        
  
        const productId = req.body.idRemoveProdCart; // Captura o valor do input
  
        console.log('ID do produto:', productId);
       
        const userId = req.session.autenticado.id;
  
  
         await connection.query(
          "DELETE FROM `Sacola` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
          [userId, productId]
        );
        console.log('Sacola');
  
        res.redirect('/cart'); 
      } catch (err) {
        console.log(err);
        res.status(500).send('Erro ao remover cart'); 
      }
    }
    );




      router.post("/create-preference", function (req, res) {
        const preference = new Preference(client);
      console.log(req.body.items);
      preference.create({
      body: {
      items: req.body.items,


      back_urls: {
      "success": process.env.URL_BASE + "/feedback" ,
      "failure": process.env.URL_BASE + "/feedback" ,
      "pending": process.env.URL_BASE + "/feedback"
      },
      auto_return: "approved",
      }
      })
      .then((value) => {
      res.json(value)
      
      })
      .catch(console.log)
      });

   

      router.get("/feedback", function (req, res) {
      pedidoControler.gravarPedido(req, res);
      });


      router.get('/pedidos', (req, res) => {
          const pedidos = req.session.pedidos || []; 
          res.render('pages/cart', { pedidos: pedidos });
      });


      // Exporta o router
      module.exports = router;



      


router.get("/pagamento",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  function (req, res) {
    res.render('pages/pagamento', { msg: 'Back-end funcionando' });
  });

  router.get("/masculino",
    verificarUsuAutenticado,
    async function (req, res) {
      const produtos = await produtosModels.findAllProductByCategoryName('masculino') || [];
      const userId = req.session.autenticado.id;


      const totalDisponiveisMasculino = await produtosModels.countAvailableMaleProducts();

      const prodFavJaExiste = await Promise.all(
        produtos.map(async (produto) => {
          const isFav = await prodModels.hasProductsFav(userId, produto.id_prod_cliente);
          return { ...produto, isFav };
        })
      );
  
      res.render('pages/masculino', { contagem: totalDisponiveisMasculino, produtos: prodFavJaExiste, user: userId, msg: 'Back-end funcionando' });
    }
  );
  

  
router.get("/feminino",
  verificarUsuAutenticado,
  async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('feminino') || [];

  const totalDisponiveisMasculino = await produtosModels.countAvailableFemaleProducts();

  const userId = req.session.autenticado.id;
      const prodFavJaExiste = await Promise.all(
        produtos.map(async (produto) => {
          const isFav = await prodModels.hasProductsFav(userId, produto.id_prod_cliente);
          return { ...produto, isFav };
        })
      );

  res.render('pages/feminino', { contagem: totalDisponiveisMasculino, produtos: prodFavJaExiste, user: userId, msg: 'Back-end funcionando' });
});

router.get("/infantil", 
  verificarUsuAutenticado,
  async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('infantil') || [];

  const totalDisponiveisMasculino = await produtosModels.countAvailableChildProducts();

  const userId = req.session.autenticado.id;
  const prodFavJaExiste = await Promise.all(
    produtos.map(async (produto) => {
      const isFav = await prodModels.hasProductsFav(userId, produto.id_prod_cliente);
      return { ...produto, isFav };
    })
  );


  res.render('pages/infantil', {  contagem: totalDisponiveisMasculino, produtos: prodFavJaExiste, user: userId, msg: 'Back-end funcionando' });
});

router.get("/acessorios",
  verificarUsuAutenticado,
  async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('acessorios') || [];

  const totalDisponiveisMasculino = await produtosModels.countAvailableLeftProducts();

  const userId = req.session.autenticado.id;
      const prodFavJaExiste = await Promise.all(
        produtos.map(async (produto) => {
          const isFav = await prodModels.hasProductsFav(userId, produto.id_prod_cliente);
          return { ...produto, isFav };
        })
      );

  res.render('pages/acessorios', { contagem: totalDisponiveisMasculino, produtos: prodFavJaExiste, user: userId, msg: 'Back-end funcionando' });
});

router.get("/vender", function (req, res) {
  const userId = req.session.autenticado.id;
  res.render('pages/vender', { user: userId, msg: 'Back-end funcionando' });
});

router.post("/enviado",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]), 
  async function (req, res) {
  

    try {
      const userId = req.session.autenticado.id;
      const envio = req.body.envio;
      await connection.query(
        'SELECT * FROM `Minhas_Vendas` WHERE id_Cliente = ? AND enviado = ? ',
        [userId, envio]
      );
      console.log(userId, envio)
  
    

     } catch (err) {
       console.log(err);
       res.status(500).send('Erro ao produto enviado'); // Opcional: resposta de erro
     }

     res.redirect('/minhas-vendas');
});


router.get("/meus-pedidos",
  pedidoControler.listarPedidos,
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  function (req, res) {

  res.render('pages/meus-pedidos', { msg: 'Back-end funcionando' });
});

router.get("/minhas-vendas", 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  pedidoControler.listarVendas
);

router.post('/atualizar-mensagem', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  pedidoControler.enviarMensagem
);


router.get('/produtos/:id_prod_cliente',
  verificarUsuAutenticado,
  async (req, res) => {
    const produtos = await produtosModels.findProducts();
  const userId = req.session.autenticado.id;
      const prodFavJaExiste = await Promise.all(
        produtos.map(async (produto) => {
          const isFav = await prodModels.hasProductsFav(userId, produto.id_prod_cliente);
          return { ...produto, isFav };
        })
      );

    try {
      const produtoId = parseInt(req.params.id_prod_cliente);

      const [random] = await connection.query('SELECT * FROM produtos WHERE Stats = "Disponível"');
      const produtosAleatorios = selecionarProdutosAleatorios(random, 4);
  
      
      // Buscar o produto pelo ID
      const [produtos] = await connection.query(
        'SELECT * FROM `produtos` WHERE id_prod_cliente = ?', 
        [produtoId]
      );

      if (produtos.length > 0) {
        const produto = produtos[0];
        const idCliente = produto.id_Cliente;
        
        // Buscar o nome do cliente (vendedor)
        const [clientes] = await connection.query(
          'SELECT nome FROM `cliente` WHERE id_Cliente = ?', 
          [idCliente]
        );

        if (clientes.length > 0) {
          const nomeCliente = clientes[0].nome;
          
          // Contar a quantidade de vendas do vendedor
          const [vendas] = await connection.query(
            `SELECT COUNT(*) AS quantidadeVendas 
             FROM pedido_item pi
             INNER JOIN produtos p ON pi.Id_prod_cliente = p.id_prod_cliente
             WHERE p.id_Cliente = ? AND p.Stats = 'Disponível'`,
            [idCliente]
          );
          
          const quantidadeVendas = vendas[0].quantidadeVendas;

          res.render('pages/produtos', { 
            listaErros: null,
            usuarioautenticado: req.session.autenticado, 
            produto: { ...produto, isFav: prodFavJaExiste.find(p => p.id_prod_cliente === produto.id_prod_cliente).isFav },
            nomeCliente: nomeCliente,
            quantidadeVendas: quantidadeVendas, 
            dadosNotificacao: null,
            random: produtosAleatorios,
            produtos: prodFavJaExiste,
            user: userId,
          });
        }
      } else {
        res.status(404).send('Produto não encontrado.');
      }
    } catch (error) {
      console.error("Erro ao carregar a página do produto:", error);
      res.status(500).send('Erro ao carregar a página do produto.');
    }
  }
);



router.get("/meusdados",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    controller.mostrarPerfil(req, res)
  });

router.post("/atualizardados",
  controller.regrasValidacaoperfil,
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {

    controller.gravarPerfil(req, res)

  });

router.get("/wishlist/",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    const userId = req.session.autenticado.id;
    const prodAddFav = await produtosModels.findAllProductfav(userId);
    console.log(prodAddFav)

    res.render('pages/wishlist', { msg: 'Back-end funcionando' , prodAddFav: prodAddFav });
  });


  router.post('/masculino/addFav', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    try {
     /* const idProd = parseInt(req.body.idProd);*/
      const date = new Date();

      const idProd = req.body.idProd; // Captura o valor do input
      const [id, titulo, preco, img1] = idProd.split(',');

      console.log('ID do produto:', id);
      console.log('Título do produto:', titulo);
      console.log('Preço do produto:', preco);
      console.log('Imagem do produto:', img1);
  
      const dataFav = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      const userId = req.session.autenticado.id
      
      const prodFavJaExiste = await prodModels.hasProductsFav(userId, id)

      if(prodFavJaExiste) {
        await connection.query(
          "DELETE FROM `Favoritos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
          [userId, id]
        );
        res.redirect('/wishlist')
      } else {
        const results = await connection.query(
          'INSERT INTO `Favoritos` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)',
          [id, dataFav, req.session.autenticado.id, titulo, preco, img1]
        );
        console.log('Favoritado');
        res.redirect('/wishlist');
      }




      

     
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar favorito'); // Opcional: resposta de erro
    }
  }
);
  router.post('/feminino/addFav', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    try {
     /* const idProd = parseInt(req.body.idProd);*/
      const date = new Date();

      const idProd = req.body.idProd; // Captura o valor do input
      const [id, titulo, preco, img1] = idProd.split(',');

      console.log('ID do produto:', id);
      console.log('Título do produto:', titulo);
      console.log('Preço do produto:', preco);
      console.log('Imagem do produto:', img1);
  
      const dataFav = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      const userId = req.session.autenticado.id
      
      const prodFavJaExiste = await prodModels.hasProductsFav(userId, id)

      if(prodFavJaExiste) {
        await connection.query(
          "DELETE FROM `Favoritos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
          [userId, id]
        );
        res.redirect('/wishlist')
      } else {
        const results = await connection.query(
          'INSERT INTO `Favoritos` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)',
          [id, dataFav, req.session.autenticado.id, titulo, preco, img1]
        );
        console.log('Favoritado');
        res.redirect('/wishlist');
      }



      

     
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar favorito'); // Opcional: resposta de erro
    }
  }
);
  router.post('/infantil/addFav', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    try {
     /* const idProd = parseInt(req.body.idProd);*/
      const date = new Date();

      const idProd = req.body.idProd; // Captura o valor do input
      const [id, titulo, preco, img1] = idProd.split(',');

      console.log('ID do produto:', id);
      console.log('Título do produto:', titulo);
      console.log('Preço do produto:', preco);
      console.log('Imagem do produto:', img1);
  
      const dataFav = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      const userId = req.session.autenticado.id
      
      const prodFavJaExiste = await prodModels.hasProductsFav(userId, id)

      if(prodFavJaExiste) {
        await connection.query(
          "DELETE FROM `Favoritos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
          [userId, id]
        );
        res.redirect('/wishlist')
      } else {
        const results = await connection.query(
          'INSERT INTO `Favoritos` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)',
          [id, dataFav, req.session.autenticado.id, titulo, preco, img1]
        );
        console.log('Favoritado');
        res.redirect('/wishlist');
      }



      

     
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar favorito'); // Opcional: resposta de erro
    }
  }
);
  router.post('/acessorios/addFav', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    try {
     /* const idProd = parseInt(req.body.idProd);*/
      const date = new Date();

      const idProd = req.body.idProd; // Captura o valor do input
      const [id, titulo, preco, img1] = idProd.split(',');

      console.log('ID do produto:', id);
      console.log('Título do produto:', titulo);
      console.log('Preço do produto:', preco);
      console.log('Imagem do produto:', img1);
  
      const dataFav = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      const userId = req.session.autenticado.id
      
      const prodFavJaExiste = await prodModels.hasProductsFav(userId, id)

      if(prodFavJaExiste) {
        await connection.query(
          "DELETE FROM `Favoritos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
          [userId, id]
        );
        res.redirect('/wishlist')
      } else {
        const results = await connection.query(
          'INSERT INTO `Favoritos` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)',
          [id, dataFav, req.session.autenticado.id, titulo, preco, img1]
        );
        console.log('Favoritado');
        res.redirect('/wishlist');
      }



      

     
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar favorito'); // Opcional: resposta de erro
    }
  }
);





  router.post('/addFav', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    try {
     /* const idProd = parseInt(req.body.idProd);*/
      const date = new Date();

      const idProd = req.body.idProd; // Captura o valor do input
      const [id, titulo, preco, img1] = idProd.split(',');

      console.log('ID do produto:', id);
      console.log('Título do produto:', titulo);
      console.log('Preço do produto:', preco);
      console.log('Imagem do produto:', img1);
  
      const dataFav = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      const userId = req.session.autenticado.id
      
      const prodFavJaExiste = await prodModels.hasProductsFav(userId, id)

      if(prodFavJaExiste) {
        await connection.query(
          "DELETE FROM `Favoritos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
          [userId, id]
        );
        res.redirect('/wishlist')
      } else {
        const results = await connection.query(
          'INSERT INTO `Favoritos` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)',
          [id, dataFav, req.session.autenticado.id, titulo, preco, img1]
        );
        console.log('Favoritado');
        res.redirect('/wishlist');
      }



      

     
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar favorito'); // Opcional: resposta de erro
    }
  }
);

router.post("/wishlist/removeFav",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {

    try {
    
      
      const productId = req.body.produtosremovefav; // Captura o valor do input

      
     
      console.log('ID do produto:', productId)
      const userId = req.session.autenticado.id;
      console.log( userId, productId);
      


       await connection.query(
        "DELETE FROM `Favoritos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
        [userId, productId]
      );
      console.log('produto do favorito removido');

      res.redirect('/wishlist'); 
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao remover produto favoritado'); // Opcional: resposta de erro
    }
    
  }
  );



  router.post('/checkFavStatus', 
    verificarUsuAutenticado,
    verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
    async function(req, res) {
    try {
        const userId = req.session.autenticado.id; // Pega o ID do usuário logado
        const idProd = req.body.idProd; // Pega o ID do produto enviado no corpo da requisição
        console.log("Produto id: ", idProd);
        
        

        // Verifica se o produto já está nos favoritos
        const prodFavJaExiste = await prodModels.hasProductsFav(userId, idProd);

        // Retorna a resposta como JSON para o frontend
        res.json({ prodFavJaExiste: prodFavJaExiste });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao verificar status do favorito' });
    }
});

  
  

router.post('/produtos/addCart', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    

    try {
      const date = new Date();

      const idProdCart = req.body.idProdCart; // Captura o valor do input
      const [id, titulo, preco, img1] = idProdCart.split(',');
      const userId = req.session.autenticado.id;
      console.log('ID do produto:', id);
      console.log('Título do produto:', titulo);
      console.log('Preço do produto:', preco);
      console.log('Imagem do produto:', img1);
  
      const dataFav = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      console.log('addtocart')


      const prodJaExiste = await cartModels.hasProducts(userId, id)

      if(prodJaExiste) {
        res.redirect('/cart')
      } else {
        await cartModels.addProducts(id, dataFav, req.session.autenticado.id, titulo, preco, img1)
        console.log('Sacola');
        res.redirect('/cart');
      }

       
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar cart'); // Opcional: resposta de erro
    }
  }
);


router.get("/adc-produto",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2]),
  async function (req, res) {
    const userId = req.session.autenticado.id;
    const user = await models.findUserById(userId);

    const quantidadeVendas = await pedidoModel.contarVendasPorCliente(userId);

    console.log(user);
    res.render('pages/adc-produto', {
      usuario: user,
      erros: null,
      usuarioautenticado: req.session.autenticado,
      listaErros: null,
      quantidadeVendas: quantidadeVendas, 
      valores: {
        tituloProduto: "",
        precoProduto: "",
        descProduto: "",
    }
    });
  });

// [, ]
router.post("/adicionar-produto",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { dadosNotificacao: null,  erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  upload.fields([{ name: 'img1' }, { name: 'img2' }, { name: 'img3' }, { name: 'img4' }]),
  controller.regrasValidacaoAdcProduto,
  async function (req, res) {
    const userId = req.session.autenticado.id;
    const user = await models.findUserById(userId);
    const errors = validationResult(req);
    const quantidadeVendas = await pedidoModel.contarVendasPorCliente(userId);
    const { tamanProduto, cateProduto, tituloProduto, precoProduto, descProduto } = req.body;

    const hasImages = req.files && (req.files.img1 && req.files.img2 && req.files.img3 && req.files.img4);

    if (!errors.isEmpty() || !hasImages) {
      if (!hasImages) {
        errors.errors.push({
          msg: "*Todas as imagens devem ser preenchidas",
          param: "img"
        });
      }
    }
    
    

    if (!errors.isEmpty()) {
      return res.render("pages/adc-produto", {
        usuario: user,
        listaErros: errors,
        dadosNotificacao: null,
        listaProdBazar: [],
        quantidadeVendas: quantidadeVendas,
        valores: {
            tituloProduto: req.body.tituloProduto,
            precoProduto: req.body.precoProduto,
            descProduto: req.body.descProduto
        }
    })
    }

    const userBazar = await produtosModels.findBazarByUserId(req.session.autenticado.id)

    const dadosProduto = {
      tituloprod: tituloProduto,
      preçoprod: precoProduto,
      descProduto: descProduto,
      cateProduto: cateProduto,
      Id_Bazar: userBazar ? userBazar.Id_Bazar : null,
      id_Cliente: req.session.autenticado.id,
      img1: req.files.img1[0].filename,
      img2: req.files.img2[0].filename,
      img3: req.files.img3[0].filename,
      img4: req.files.img4[0].filename,
      Stats: "Disponivel",
      tamanho: tamanProduto,
    }


    const createProd = await produtosModels.createProd(dadosProduto)
    console.log(createProd)
    res.redirect("/produtos-adicionados")
  });

router.post("/sign/register", controller.regrasValidacaocadastro, async function (req, res) {
  const erros = validationResult(req);

  console.log(erros);

  if (!erros.isEmpty()) {
    return res.render('pages/cadastro', {
      erros: erros, dadosNotificacao:null, dadosform: {
        nome: req.body.nome,
        cpf: req.body.cpf,
        dia: req.body.dia,
        mes: req.body.mes,
        ano: req.body.ano,
        email: req.body.email,
        senha: req.body.senha,
        confirmsenha: req.body.confirmsenha,
        cep: req.body.cep
      },
      logado: false
    });
  }

  try {
    const { nome, cpf, dia, mes, ano, email, senha } = req.body;

    const nasc = `${ano}-${mes}-${dia}`

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(senha, salt);

    const create = await connection.query("INSERT INTO cliente (nome, cpf, nasc, email, senha, Id_Tipo_Usuario, Stats) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nome, cpf, nasc, email, hashedPassword, 1, "Ativo"]);

    const [user] = await connection.query("SELECT * FROM `cliente` WHERE email = ?", [email])
    console.log(user[0].id_Cliente)

      const token = jwt.sign(
        { userId: user[0].id_Cliente },
        process.env.SECRET_KEY
      );
      console.log(token);
      const html = require('../util/email-ativar-conta')(process.env.URL_BASE, token);
      enviarEmail(email, "Verificação de Email", null, html, ()=>{
        res.render('pages/login_do_usuario', { 
          erros: null,
          logado: false,
          usuarioautenticado: null,
          dadosform: { email: "", senha: "" },
          dadosNotificacao: {
            msg: "Email de verificação enviado",
            type: "success",
            title: "Verifique o Email"
          }
        })
      });
    


    // const usuario = await connection.query("SELECT * FROM cliente WHERE id_Cliente = ?", [create.insertId]);
    // req.session.autenticado = {
    //   autenticado: usuario[0].nome,
    //   id: usuario[0].id_Cliente,
    //   tipo: usuario[0].Id_Tipo_Usuario
    // }

    // res.render('pages/login_do_usuario', { erros: null, dadosform: { email: req.body.email, senha: req.body.senha }, logado: true, usuarioautenticado: req.session.userid })
  } catch (error) {
    console.log(error)
  }
});

router.get("/ativar-conta",async function (req, res) {
  try {
    const token = req.query.token;
    console.log(token);
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      console.log(decoded);
      if (err) {
        console.log({ message: "Token inválido ou expirado" });
      } else {
        const user = await connection.query("SELECT * FROM `cliente` WHERE id_Cliente = ?", [decoded.userId]);
        if (!user) {
          console.log({ message: "Usuário não encontrado" });
        } else {
          let resultUpdate = await connection.query("UPDATE `cliente` SET Status_User = 1 WHERE id_Cliente = ?", [decoded.userId])
          console.log({ message: "Conta ativada" });
          res.render("pages/login_do_usuario", {
            erros: null,
            logado: false,
            usuarioautenticado: req.session.autenticado,
            dadosform: { email: '', senha: '' },
            dadosNotificacao: {
              title: "Sucesso",
              msg: "Conta ativada, use seu e-mail e senha para acessar o seu perfil!",
              type: "success",
            },
          });
        }
        // Ativa a conta do usuário
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/sign/login", 
  controller.regrasValidacaolog, 
  async function (req, res) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    console.log(erros);
    return res.render('pages/login_do_usuario', 
      { erros: erros,dadosNotificacao: null, dadosform: { email: req.body.email, senha: req.body.senha }, logado: false, usuarioautenticado: req.session.userid });
  }

  try {
    const { email } = req.body;
    const [user] = await connection.query("SELECT * FROM cliente WHERE email = ?", [email]);
    req.session.autenticado = { autenticado: user[0].nome, id: user[0].id_Cliente, tipo: user[0].Id_Tipo_Usuario }
    if (req.session.autenticado.tipo == 3) {
      res.redirect("/adm");
    }
    res.redirect("/perfil");

  } catch (error) {
    console.log("erro:" + error)
  }
});

router.get('/sair', limparSessao, function (req, res) {
  res.redirect('/');
});

router.post("/update", controller.regrasValidacaocadastro, function (req, res) {

});

router.post("/delete", function (req, res) {

});

router.get("/adc-bazar",

  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    dadosNotificacao: null,
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [2, 3]
  ), async function (req, res) {
    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    if (bazar){
      bazarController.dadosBazar(req,res)
    }else{
      res.render('pages/adc-bazar.ejs' , { 
        Bazar: bazar, 
        listaErros: null, 
        valores: {
          Nome: "",
          Ano: "",
          Descricao: "",
          Titulo: "",
          Biografia: "",
          imgBazar: "",
      }});
    }
  })


  router.post("/bazarAdc", 
    verificarUsuAutenticado,
    verificarUsuAutorizado(
        "./pages/login_do_usuario", {
            dadosNotificacao: null,
            erros: null,
            dadosform: { email: "", senha: "" },
            logado: false,
            usuarioautenticado: null
        }, [2, 3]
    ),
    uplImg('imgBazar'), 
    controller.regrasValidaçãoBazar, 
    function (req, res) {
        bazarController.submitBazar(req, res);
    }
);

router.post("/attBazar", 
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
      dadosNotificacao: null,
      erros: null,
      dadosform: { email: "", senha: "" },
      logado: false,
      usuarioautenticado: null
    },
    [2, 3]
  ), 
  uplImg('imgBazar'),
  controller.regrasValidaçãoBazar,
  function (req, res) {
    bazarController.alterarBazar(req, res);
  }
);

router.post("/denunciar-produto/:id_prod_cliente",
  controller.regrasValidaçãoDenunciaP,
  verificarUsuAutenticado, 
  verificarUsuAutorizado(   
    "./pages/login_do_usuario", {
      dadosNotificacao: null,
      erros: null,
      dadosform: { email: "", senha: "" },
      logado: false,
      usuarioautenticado: null
    },
    [1, 2, 3] 
  ), 
  function (req, res) {
    denunciaController.denunciarP(req, res);
  }
);

router.post("/denunciar-vendedor/:id_prod_cliente",
  controller.regrasValidaçãoDenunciaV,
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
      dadosNotificacao: null,
      erros: null,
      dadosform: { email: "", senha: "" },
      logado: false,
      usuarioautenticado: null
    },
    [1, 2, 3]
  ), 
  function (req, res) {
    denunciaController.denunciarV(req, res);
  }
);

router.post('/banir/:id_Cliente_denunciado', 
  denunciaController.banirCliente,
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
      dadosNotificacao: null,
      erros: null,
      dadosform: { email: "", senha: "" },
      logado: false,
      usuarioautenticado: null
    },
    [1, 2, 3]
  ));


router.get("/denuncias-usu", async function (req, res) {
  const userId = req.session.autenticado.id;
  const denuncias = await denunciasModels.listarDenunciasUsu(userId);
  const jsonResult = {
      denuncias: denuncias,
  };
  res.render('pages/denuncias-usu', jsonResult);
});


router.get("/pesquisa", async function (req, res) {
  const userId = req.session.autenticado.id;
  res.render('pages/pesquisa', { user: userId, posts:null });
});


router.post("/search", async function (req, res) {
  try {
      const userId = req.session.autenticado.id;
      const termoPesquisa = `%${req.body.pesquisaInput}%`;
      const produtos = await produtosModels.acharPorTermo(termoPesquisa) || [];
      if (produtos.length === 0) {
          const jsonResult = {
              posts: "none",
              user: userId,
          };
          return res.render("./pages/pesquisa", jsonResult);
      }
      const posts = {
          produtos: produtos,
      };
      const jsonResult = {
          user: userId,
          posts: posts,
      };
      return res.render("./pages/pesquisa", jsonResult);
  } catch (error) {
      console.error(error);
      return res.status(404)
  }
});


router.get("/redsenha", function (req, res) {

  res.render('pages/redsenha',{    
    dadosNotificacao: null,
    dadosform: null,
    erros: null, 
    logado: false,
    usuarioautenticado: req.session.userid
   });
});

router.post("/redefinir",
  controller.regrasValidacaoRedefinir,
  async function (req, res) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    console.log(erros);
    return res.render('pages/redsenha', 
      { erros: erros, 
        dadosform: { 
          email: req.body.email, 
          senha: req.body.senha, 
          confirmar: req.body.senha, 
        }, 
        dadosNotificacao: null,
        logado: false, 
        usuarioautenticado: req.session.userid });
  }
  
  const [user] = await connection.query("SELECT * FROM `cliente` WHERE email = ?", [req.body.email])
  const token = jwt.sign(
    { userId: user[0].id_Cliente,
      senhaNova: req.body.senha
     },
    process.env.SECRET_KEY
  );
  console.log(token);
  const html = require('../util/email-reset-senha')(process.env.URL_BASE, token);
  enviarEmail(req.body.email, "Email de Redefinição de senha", null, html, ()=>{
    res.render('pages/login_do_usuario', { 
      logado: false,
      usuarioautenticado: null,
      erros: null,
      dadosform: { email: "", senha: "" },
      dadosNotificacao: {
        msg: "Email de verificação enviado",
        type: "success",
        title: "Verifique o Email"
      }
    })
  });
});

router.get("/resetar-senha", async function (req, res) {
  try {
    const token = req.query.token;
    console.log(token);
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      console.log(decoded);
      if (err) {
        console.log({ message: "Token inválido ou expirado" });
      } else {
        const user = await connection.query("SELECT * FROM `cliente` WHERE id_Cliente = ?", [decoded.userId]);
        if (!user) {
          console.log({ message: "Usuário não encontrado" });
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(decoded.senhaNova, salt);
          const resultado = await connection.query("UPDATE `cliente` SET senha = ? WHERE id_Cliente = ?", [hashedPassword, decoded.userId]);
          console.log({ message: "Conta ativada" });
          res.render("pages/login_do_usuario", {
            erros: null,
            logado: false,
            usuarioautenticado: req.session.autenticado,
            dadosform: { email: '', senha: '' },
            dadosNotificacao: {
              title: "Sucesso",
              msg: "Senha alterada com sucesso, use seu e-mail e senha para acessar o seu perfil!",
              type: "success",
            },
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/endere",
  controller.regrasValidacaoEndereco,
  verificarUsuAutenticado,
  verificarUsuAutorizado("./pages/login_do_usuario", {
    dadosNotificacao: null,
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    const erros = validationResult(req);
    const userId = req.session.autenticado.id;
    const user = await models.findUserById(userId);
    const cart = await cartModels.findAllProductByUserId(userId);
    const [random] = await connection.query('SELECT * FROM produtos WHERE Stats = "Disponível"');
    const produtosAleatorios = selecionarProdutosAleatorios(random, 4);
    const { cep, numero } = req.body;

    if (!erros.isEmpty()) {
      return res.render("pages/cart", {
        listaErros: erros,
        random: produtosAleatorios,
        cart: cart,
        usuario: user,
        dadosNotificacao: null,
        valores: {
          cep: req.body.cep,
          numero: req.body.numero,
        }
      });
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      const enderecoCompleto = `${data.logradouro || ""}, ${data.bairro || ""}, ${data.localidade || ""} - ${data.uf || ""}`;
      console.log("Endereço completo formatado:", enderecoCompleto);

      const [result] = await connection.query(
        "UPDATE cliente SET cep = ?, casa = ? WHERE id_Cliente = ?", [enderecoCompleto, numero, userId]);

      const [userAddress] = await connection.query(
        "SELECT cep, casa FROM cliente WHERE id_Cliente = ?", [userId]
      );
    
        const novovalores = {
          cep: userAddress[0]?.cep || '',  
          numero: userAddress[0]?.casa || ''
        };

      const userAtualizado = await models.findUserById(userId);

      console.log("Endereço atualizado com sucesso.");
      res.render("pages/cart", {
        erros: null,
        listaErros: null,
        random: produtosAleatorios,
        cart: cart,
        usuario: userAtualizado,
        valores: novovalores,
        dadosNotificacao: { 
          title: "Endereço Atualizado", 
          msg: "Endereço atualizado com sucesso", 
          type: 'success' 
      },
      });
    } catch (error) {
      console.error("Erro durante a atualização do endereço:", error);
      return res.redirect("/cart");
      
    }
  }
);



module.exports = router;