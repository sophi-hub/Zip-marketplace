const pool = require("../../config/pool_conexoes");
const { body, validationResult } = require("express-validator");
const models = require("../models/models");
const admModel = require("../models/admModels");
const produtosModels = require("../models/produtos.models");
const denunciasModels = require("../models/denunciasModels");

function selecionarProdutosAleatorios(produtos, quantidade) {
    for (let i = produtos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [produtos[i], produtos[j]] = [produtos[j], produtos[i]];
    }
    return produtos.slice(0, quantidade);
  }
const denunciaController = {
    
    denunciarP: async (req, res) => {
        try {
            const userId = req.session.autenticado.id;
            const produtoId = parseInt(req.params.id_prod_cliente);

            const [random] = await pool.query('SELECT * FROM produtos WHERE Stats = "Disponível"');
            const produtosAleatorios = selecionarProdutosAleatorios(random, 4);

            const [produtos] = await pool.query('SELECT * FROM `produtos` WHERE id_prod_cliente = ?', [produtoId]);
            if (produtos.length === 0) {
                return res.status(404).render('pages/produtos', {
                    usuarioautenticado: req.session.autenticado,
                    dadosNotificacao: { 
                        title: "Produto não encontrado", 
                        msg: "Produto não existe", 
                        type: 'error' 
                    }
                });
            }
    
            const [denunciasExistentes] = await pool.query(
                'SELECT * FROM `denuncias_produto` WHERE id_Cliente = ? AND id_prod_cliente = ?',
                [userId, produtoId]
            );
    
            const produto = produtos[0];
            let quantidadeVendas = 0;
            let nomeCliente = null;
    
            const idCliente = produto.id_Cliente;
    
            const [clientes] = await pool.query(
                'SELECT nome FROM `cliente` WHERE id_Cliente = ?', 
                [idCliente]
            );
    
            if (clientes.length > 0) {
                nomeCliente = clientes[0].nome;
    
                const [vendas] = await pool.query(
                    `SELECT COUNT(*) AS quantidadeVendas 
                     FROM pedido_item pi
                     INNER JOIN produtos p ON pi.Id_prod_cliente = p.id_prod_cliente
                     WHERE p.id_Cliente = ? AND p.Stats = 'Disponível'`,
                    [idCliente]
                );
    
                if (vendas.length > 0) {
                    quantidadeVendas = vendas[0].quantidadeVendas;
                }
            }
    
            if (denunciasExistentes.length > 0) {
                return res.render('pages/produtos', {
                    usuarioautenticado: req.session.autenticado, 
                    produto: produto,
                    nomeCliente: nomeCliente,
                    quantidadeVendas: quantidadeVendas,
                    listaErros: null,
                    random: produtosAleatorios,
                    user: userId,
                    dadosNotificacao: { 
                        title: "Você já denunciou este produto", 
                        msg: "Produto já denunciado", 
                        type: 'info' 
                    }
                });
            }

            let erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.render('pages/produtos', {
                    usuarioautenticado: req.session.autenticado, 
                    produto: produto,
                    nomeCliente: nomeCliente,
                    quantidadeVendas: quantidadeVendas,
                    random: produtosAleatorios,
                    user: userId,
                    dadosNotificacao: { 
                        title: "Preencha um dos campos", 
                        msg: "Campos vazios", 
                        type: 'warning' 
                    }
                });
            }
    
            const motivos = req.body.Caixa || [];
            const dadosDenuncia = {
                id_prod_cliente: produtoId,
                id_Cliente: userId,
                repetido: motivos.includes('repetido'),
                fora_tema: motivos.includes('foraTema'),
                ma_qualidade: motivos.includes('maQualidade')
            };
    
            await denunciasModels.denunciarProd(dadosDenuncia);
    
            return res.render('pages/produtos', {
                usuarioautenticado: req.session.autenticado, 
                produto: produto,
                nomeCliente: nomeCliente,
                quantidadeVendas: quantidadeVendas,
                listaErros: null,
                random: produtosAleatorios,
                user: userId,
                dadosNotificacao: { 
                    title: "Sua denúncia foi enviada", 
                    msg: "Denúncia realizada com sucesso", 
                    type: 'success' 
                }
            });
        } catch (error) {
            console.error("Erro ao processar a denúncia:", error);
            res.redirect('/')
        }
    },
    




    denunciarV: async (req, res) => {
        try {
            const userId = req.session.autenticado.id; 
            const produtoId = parseInt(req.params.id_prod_cliente);

            const [random] = await pool.query('SELECT * FROM produtos WHERE Stats = "Disponível"');
            const produtosAleatorios = selecionarProdutosAleatorios(random, 4);
    
            const [produtos] = await pool.query('SELECT * FROM `produtos` WHERE id_prod_cliente = ?', [produtoId]);
            if (produtos.length === 0) {
                return res.status(404).send("Produto não encontrado.");
            }
    
            const produto = produtos[0];
            const idClienteDenunciado = produto.id_Cliente;  

            const [denunciasExistentes] = await pool.query(
                'SELECT * FROM `denuncias_vendedor` WHERE id_Cliente = ? AND id_Cliente_denunciado = ?',
                [userId, idClienteDenunciado]
            );
    
            let quantidadeVendas = 0;
            let nomeCliente = null;
    
            const [clientes] = await pool.query(
                'SELECT nome FROM `cliente` WHERE id_Cliente = ?', 
                [idClienteDenunciado]
            );
    
            if (clientes.length > 0) {
                nomeCliente = clientes[0].nome;
    
                const [vendas] = await pool.query(
                    `SELECT COUNT(*) AS quantidadeVendas 
                     FROM pedido_item pi
                     INNER JOIN produtos p ON pi.Id_prod_cliente = p.id_prod_cliente
                     WHERE p.id_Cliente = ? AND p.Stats = 'Disponível'`,
                    [idClienteDenunciado]
                );
    
                if (vendas.length > 0) {
                    quantidadeVendas = vendas[0].quantidadeVendas;
                }
            }
    
            if (denunciasExistentes.length > 0) {
                const jsonResult = {
                    usuarioautenticado: req.session.autenticado, 
                    produto: produto,
                    nomeCliente: nomeCliente,
                    quantidadeVendas: quantidadeVendas,
                    random: produtosAleatorios,
                    user: userId,
                    dadosNotificacao: { 
                        title: "Você já denunciou este vendedor", 
                        msg: "Vendedor já denunciado", 
                        type: 'info' 
                    }
                };
                return res.render('pages/produtos', jsonResult);
            }
    
            let erros = validationResult(req);
            if (!erros.isEmpty()) {
                const jsonResult = {
                    usuarioautenticado: req.session.autenticado, 
                    produto: produto,
                    nomeCliente: nomeCliente,
                    quantidadeVendas: quantidadeVendas,
                    random: produtosAleatorios,
                    user: userId,
                    dadosNotificacao: { 
                        title: "Preencha um dos campos", 
                        msg: "Campos vazios", 
                        type: 'warning' 
                    }
                };
                return res.render('pages/produtos', jsonResult);
            }

            const motivos = req.body.Caixo || [];
    
            const dadosDenunciaV = {
                id_Cliente: userId, 
                id_Cliente_denunciado: idClienteDenunciado, 
                fraude: motivos.includes('fraude'), 
                produto_ilicito: motivos.includes('produtoIlicito'),
                propaganda_enganosa: motivos.includes('propagandaEnganosa'),
            };
    
            await denunciasModels.denunciarVend(dadosDenunciaV);
    
            const jsonResult = {
                usuarioautenticado: req.session.autenticado, 
                produto: produto,
                nomeCliente: nomeCliente,
                quantidadeVendas: quantidadeVendas,
                random: produtosAleatorios,
                user: userId,
                dadosNotificacao: { 
                    title: "Sua denúncia foi enviada", 
                    msg: "Denúncia realizada com sucesso", 
                    type: 'success' 
                }
            };
            return res.render('pages/produtos', jsonResult);
        } catch (error) {
            console.error("Erro ao processar a denúncia:", error);
            res.redirect('/')
        }
    },

    banirCliente: async (req, res) => {
        try {
            const idClienteDenunciado = req.params.id_Cliente_denunciado;
    
            await pool.query('UPDATE cliente SET Stats = ? WHERE id_Cliente = ?', ["Inativo", idClienteDenunciado]);

            await pool.query('UPDATE produtos SET Stats = ? WHERE id_Cliente = ? AND Stats != ?', ["Inativo", idClienteDenunciado, "Vendido"]);

            await pool.query(`
                DELETE FROM Sacola 
                WHERE Id_prod_cliente IN (
                    SELECT id_prod_cliente FROM produtos 
                    WHERE id_Cliente = ? AND Stats = ?
                )`, [idClienteDenunciado, "Inativo"]);

             await pool.query(`
                 DELETE FROM Favoritos 
                 WHERE Id_prod_cliente IN (
                     SELECT id_prod_cliente FROM produtos 
                     WHERE id_Cliente = ? AND Stats != ?
                 )`, [idClienteDenunciado, "Disponível"]);

            await pool.query(`
                DELETE FROM denuncias_produto
                WHERE id_prod_cliente IN (
                    SELECT id_prod_cliente FROM produtos 
                    WHERE id_Cliente = ? AND Stats != ?
                )`, [idClienteDenunciado, "Disponível"]);
       
    
    
            res.redirect('/adm-denuncias');
    
        } catch (error) {
            console.error("Erro ao banir o cliente:", error);
            res.status(500).send("Erro ao banir o cliente.");
        }
    },



}

module.exports = denunciaController;