const pool = require("../../config/pool_conexoes");
const bcrypt = require('bcrypt');
const { body, validationResult, check } = require("express-validator");
const models = require("../models/models");
const produtosModels = require('../models/produtos.models');
const pedidoModel = require('../models/pedidoModel');
const denunciasModels = require('../models/denunciasModels');

function selecionarProdutosAleatorios(produtos, quantidade) {
  for (let i = produtos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [produtos[i], produtos[j]] = [produtos[j], produtos[i]];
  }
  return produtos.slice(0, quantidade);
}

const controller = {
  regrasValidacaocadastro: [
    body('nome').trim().isAlpha('pt-BR', { ignore: ' ' }).withMessage('*Nome Inválido'),
    body('cpf')
    .customSanitizer(value => value.replace(/[\.\-]/g, ''))
    .custom(async value => {
      const [cpf] = await pool.query('SELECT * FROM cliente WHERE cpf = ?', [value]);
      if (cpf.length > 0) {
        throw new Error('*CPF em uso!');
      }
  
      // Validação do CPF
      let soma = 0;
      for (let i = 1; i <= 9; i++) {
        soma += parseInt(value.substring(i - 1, i)) * (11 - i);
      }
      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(value.substring(9, 10))) {
        throw new Error("*CPF inválido!");
      }
  
      soma = 0;
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(value.substring(i - 1, i)) * (12 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(value.substring(10, 11))) {
        throw new Error("*CPF inválido!");
      }
    }),

    // body('cep')
    // .customSanitizer(value => value.replace('-', '')) // Tira os hífens
    // .isLength({ min: 8, max: 8 }).isNumeric().withMessage('*CEP Inválido'),


    body('dia').isInt({ min: 1, max: 31 }).withMessage('*Dia Inválido'),
    body('mes').isInt({ min: 1, max: 12 }).withMessage('*Mês Inválido'),
    body('ano').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('*Ano Inválido'),
    body('email').isEmail().withMessage('*Email Inválido')
      .custom(async value => {
        const [email] = await pool.query('SELECT * FROM cliente WHERE email = ?', [value]);
        if (email.length > 0) {
          throw new Error('*Email em uso!');
        }
      }),

    body('senha').isStrongPassword().withMessage('*A senha é fraca'),
  body('confirmsenha').custom((value, { req }) => {
    if (value !== req.body.senha) {
      throw new Error('*As senhas não são iguais');
    }
    return true;
  }),
  body('Privacidade').equals('on').withMessage('*É presiso aceitar os termos')


  ],
  regrasValidacaolog: [
    body('email').isEmail().withMessage('*Email Inválido'),
    body('senha').custom(async (senha, { req }) => {
      try {
        const [users] = await pool.query("SELECT * FROM cliente WHERE email = ?", [req.body.email]);
        if (users.length === 0) {
          throw new Error('Usuário não encontrado.');
        }
  
        const user = users[0];
  
        if (user.Stats !== 'Ativo') {
          throw new Error('Sua conta está banida.');
        }

        if (user.Status_User == "0") {
          throw new Error('Sua conta não foi ativada. Verifique seu email.');
        }
  
        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) {
          throw new Error('Senha incorreta.');
        }
  
        return true;
      } catch (err) {
        console.error('Erro de autenticação:', err);
        throw new Error('Erro na autenticação. Tente novamente.');
      }
    }),
  ],
  regrasValidacaoRedefinir: [
    body('email')
    .custom(async (senha, { req }) => {
      try {
        const [users] = await pool.query("SELECT * FROM cliente WHERE email = ?", [req.body.email]);
        if (users.length === 0) {
          throw new Error('Email não está cadastrado.');
        }

        return true;
      } catch (err) {
        console.error(err);
        throw new Error(err);
      }
    }),
    body('senha').isStrongPassword().withMessage('*A senha é fraca'),
    body('confirmar').custom((value, { req }) => {
      if (value !== req.body.senha) {
        throw new Error('*As senhas não são iguais');
      }
      return true;
    }),

  ],
  regrasValidacaoAdcProduto: [
    body('tituloProduto').isString().isLength({ min: 3, max: 30 }).withMessage("*O Titulo deve ter de 3 a 30 caracteres!"),
    body('precoProduto')
    .isNumeric().withMessage("*O preço deve ser um número")
    .custom((value) => value >= 0.1).withMessage("*O preço deve ser no mínimo R$ 0.10"),
    body('descProduto').isString().isLength({ min: 25, max: 220 }).withMessage("*A Descrição deve ter de 25 a 220 caracteres!"),
  ],

  regrasValidacaoperfil: [
    body('nome').isLength({ min: 3, max: 45 }).withMessage("*Nome deve ter de 3 a 45 caracteres!"),
    body('email').isEmail().withMessage('*Email Inválido'),
    // body('email').isEmail().withMessage('*Email Inválido')
    // .custom(async value => {
    //   const [email] = await pool.query('SELECT * FROM cliente WHERE email = ?', [value]);
    //   if (email.length > 0) {
    //     throw new Error('*Email em uso!');
    //   }
    // }),
    body('senha').custom((senha, {req}) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_])/;
      if (!senha){
        return true
      }  
      if (senha.length < 8 || !regex.test(senha)){
        throw new Error('*A senha é fraca');
      }
      return true
    })
  ],

  mostrarPerfil: async (req, res) => {
    const user = await models.findUserById(req.session.autenticado.id)
    const bazar = await produtosModels.findBazarByUserId(user);
    const data = new Date(user.nasc)
    const dataFormatada = data.toISOString().split('T')[0];
    try {
      let campos = {
        nome: user.nome,
        cpf: user.cpf,
        nasc: user.nasc,
        email: user.email,
        nasc: dataFormatada,
        senha: ""
      };

      return res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: null, valores: campos, Bazar:bazar, formAprovado: false });
    } catch (e) {
      console.log(e);
      return res.render("pages/Config/meusdados",
        {
          listaErros: null,
          dadosNotificacao: null,
          Bazar:bazar,
          valores: {
            nome: "",
            cpf: "",
            nasc: "",
            email: "",
            nasc: "",
            senha: ""
          }
        });
    }
  },

  gravarPerfil: async (req, res) => {
    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    const quantidadeVendas = await pedidoModel.contarVendasPorCliente(userId);
    const erros = validationResult(req);
    const erroMulter = req.session.erroMulter;

    const [random] = await pool.query('SELECT * FROM produtos WHERE Stats = "Disponível"');
    const produtosAleatorios = selecionarProdutosAleatorios(random, 4);

    const totalVendasNaoEnviadas = await pedidoModel.contarVendasNaoEnviadas(userId);

    const totalDenuncias = await denunciasModels.contarDenunciasUsu(userId);

    if (!erros.isEmpty() || erroMulter != null) {
      let lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
      if (erroMulter != null) {
        lista.errors.push(erroMulter);
      }
      console.log(lista);

      const user = await models.findUserById(userId);
      return res.render("pages/Config/meusdados", {
        usuario: user,
        Bazar: bazar,
        listaErros: lista,
        dadosNotificacao: null,
        listaProdBazar: [],
        valores: {
          nome: req.body.nome,
          email: req.body.email,
          cpf: req.body.cpf,
          nasc: req.body.nasc,
        },
      });
    }

    try {
      let { nome, email, nasc, senha } = req.body;
      var dadosForm = {
        nome: nome,
        email: email,
        nasc: nasc,
      };
    
      if (senha && senha.trim() !== "") {
        const salt = bcrypt.genSaltSync(10);
        dadosForm.senha = bcrypt.hashSync(senha, salt);
      }
    
      let resultUpdate = await models.update(dadosForm, userId);
      console.log("resultUpdate", resultUpdate);
    
      if (resultUpdate.changedRows > 0) {
        var userAtualizado = await models.findUserById(userId);
        const data = new Date(userAtualizado.nasc);
        const dataFormatada = data.toISOString().split("T")[0];
    
        var autenticado = {
          autenticado: userAtualizado.nome,
          id: userAtualizado.id_Cliente,
          tipo: userAtualizado.Id_Tipo_Usuario,
        };
    
        req.session.autenticado = autenticado;
        let campos = {
          nome: userAtualizado.nome,
          cpf: userAtualizado.cpf,
          nasc: dataFormatada,
          email: userAtualizado.email,
          senha: "",
        };
    
        return res.render("pages/perfil", {
          listaErros: null,
          dadosNotificacao: {
            title: "Perfil atualizado com sucesso!",
            msg: "Alterações Gravadas",
            type: "success",
          },
          formAprovado: true,
          Bazar: bazar,
          quantidadeVendas: quantidadeVendas,
          usuario: userAtualizado,
          valores: campos,
          random: produtosAleatorios,
          totalDenuncias: totalDenuncias,
          totalVendasNaoEnviadas: totalVendasNaoEnviadas,
        });
      } else {
        const user = await models.findUserById(userId);
        return res.render("pages/perfil", {
          listaErros: null,
          dadosNotificacao: {
            title: "Perfil atualizado com sucesso!",
            msg: "Sem Alterações",
            type: "info",
          },
          random: produtosAleatorios,
          Bazar: bazar,
          quantidadeVendas: quantidadeVendas,
          usuario: user,
          valores: dadosForm,
          totalDenuncias: totalDenuncias,
          totalVendasNaoEnviadas: totalVendasNaoEnviadas,
        });
      }
    } catch (e) {
      console.log(e);
    
      const user = await models.findUserById(userId);
      return res.render("pages/Config/meusdados", {
        listaErros: null,
        dadosNotificacao: {
          title: "Erro ao atualizar o perfil!",
          msg: "Verifique os valores digitados!",
          type: "error",
        },
        formAprovado: false,
        Bazar: bazar,
        usuario: user,
        valores: req.body,
      });
    }
  },
    

  mostrarProduto: async (req, res) => {
    try {
      const userId = req.session.autenticado.id;
      const produtoId = parseInt(req.params.id_prod_cliente);
      const [produto] = await produtosModels.findProdById(produtoId)
      console.log(produto);
      
      if (produto) {
          res.render('pages/produtos', { usuarioautenticado: req.session.autenticado, produto: produto[0], user: userId })
      } else {
          res.status(404).send('Produto não encontrado');
      }
    } catch (err) {
      console.log(err);
    }
  },

  regrasValidaçãoURL: [
    body('socialLinks')
    .notEmpty()
    .isURL()
    .withMessage('O link deve ser uma URL válida.')
    .matches(/^(https:\/\/(www\.)?(instagram\.com|youtube\.com|tiktok\.com))/)
    .withMessage('O link deve ser do Instagram, YouTube ou TikTok.')
  ],

  regrasValidaçãoBazar: [
    body('Nome')
      .isString()
      .isLength({ min: 2, max: 15 })
      .withMessage('*O nome deve ter entre 2 e 15 caracteres.'),
      
    body('Ano')
    .isInt({ min: 2000, max: new Date().getFullYear() }).withMessage('*Ano Inválido'),
      
    body('Descricao')
      .isString()
      .isLength({ min: 5, max: 35 })
      .withMessage('*A descrição deve ter entre 5 e 35 caracteres.'),
      
    body('Titulo')
      .isString()
      .isLength({ min: 3, max: 25 })
      .withMessage('*O título deve ter entre 3 e 25 caracteres.'),
      
    body('Biografia')
      .isString()
      .isLength({ min: 10, max: 400 })
      .withMessage('*A biografia deve ter entre 10 e 400 caracteres.')
  ],

  regrasValidaçãoDenunciaP: [
    check('Caixa').custom((valores, {req}) => {
        if (!req.body.Caixa || req.body.Caixa.length === 0) {
            throw new Error('*Selecione pelo menos um motivo');
        }
        return true;
    })
],

regrasValidaçãoDenunciaV: [
  check('Caixo').custom((valores, {req}) => {
      if (!req.body.Caixo || req.body.Caixo.length === 0) {
          throw new Error('*Selecione pelo menos um motivo');
      }
      return true;
  })
],

regrasValidacaoEndereco: [
  body('cep').custom(async (value, { req }) => {
    const cep = value.replace(/\D/g, '');

    if (cep.length !== 8) {
      throw new Error('CEP inválido. O CEP deve ter 8 dígitos.');
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado.');
      }
      
      req.body.enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar o endereço. Tente novamente.');
    }
  }),
  body('numero').notEmpty().withMessage('O número da casa é obrigatório.'),
],


};

module.exports = controller;


