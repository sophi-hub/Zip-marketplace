const pool = require("../../config/pool_conexoes");

const pedidoModel = {




    createPedido: async (pedido) => {
        try {

            const [linhas] = await pool.query('INSERT INTO pedidos(Id_Pedidos_Loji, Data_Pedido, id_Cliente, status_pedido, status_pagamento, id_pagamento) VALUES (? ,? , ?, ?, ?, ?) ', [pedido.id_pagamento, pedido.data, pedido.usuario_id_usuario, pedido.status_pedido, pedido.status_pagamento, pedido.id_pagamento ]);
            return linhas ;
        } catch (error) {
            return error;
        }
    },

    createItemPedido: async (pedido_items) => {
        try {
            console.log(pedido_items)
            //const [linhas] = await pool.query('INSERT INTO pedido_item(Id_prod_cliente, Id_Pedidos_Loji, quantidade) VALUES (?, ?, ?) ', [pedido_items ]);
            //return linhas ;


           var sql = "INSERT INTO `pedido_item`(`Id_prod_cliente`, `Id_Pedidos_Loji`, `quantidade`, `tituloprod`) VALUES ?";

        //var sql = "INSERT INTO pedido_item(Id_prod_cliente, Id_Pedidos_Loji, quantidade, tituloprod) VALUES ?";

            var values = pedido_items;

            const [linhas] =  await pool.query(sql, [values],function(err) {
                if (err) throw err;
                pool.end();
            });
            return linhas ;
        } catch (error) {
            return error;
        }
    },


   

    deleteItemPedido: async (delete_items) => {
        try {
            console.log(delete_items);
    
            var updateSql = "UPDATE produtos SET Stats = 'Vendido' WHERE Id_prod_cliente IN (?)";
            var values = delete_items;
    

            var deleteSqlSacola = "DELETE FROM Sacola WHERE Id_prod_cliente IN (?)";
            var deleteSqlFavoritos = "DELETE FROM Favoritos WHERE Id_prod_cliente IN (?)";
    
            const [updateResult] = await pool.query(updateSql, [values]);
            const [deleteResultSacola] = await pool.query(deleteSqlSacola, [values]);
            const [deleteResultFavoritos] = await pool.query(deleteSqlFavoritos, [values]);
    
            return { updateResult, deleteResultSacola, deleteResultFavoritos };
        } catch (error) {
            return error;
        } 
    },


    pedidoIdprod: async (userId, produtoId) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM `pedido_item` WHERE `id_Cliente` = ? AND id_prod_cliente = ?', [userId, produtoId]);

            return linhas;
        } catch (error) {
            return error;
        }
    },

    getPedidosByCliente: async (id_Cliente, callback) => {
        const query = `
            SELECT 
                pedido_item.tituloprod AS produto_comprado,
                cliente.nome AS vendedor_nome,
                pedido_item.localiza AS status_envio
            FROM 
                pedidos
            JOIN 
                pedido_item ON pedidos.Id_Pedidos_Loji = pedido_item.Id_Pedidos_Loji
            JOIN 
                produtos ON pedido_item.Id_prod_cliente = produtos.Id_prod_cliente
            JOIN 
                cliente ON produtos.id_Cliente = cliente.id_Cliente
            WHERE 
                pedidos.id_Cliente = ?`;
        
        try {
            const [rows] = await pool.query(query, [id_Cliente]);
            callback(null, rows);
        } catch (err) {
            callback(err, null);
        }
    },
    
    getVendasByCliente: async (id_Cliente, callback) => {
        const query = `
            SELECT 
                pedido_item.tituloprod AS produto_vendido,
                cliente.nome AS comprador_nome,
                cliente.cep AS comprador_cep,
                cliente.casa AS comprador_casa,
                pedido_item.localiza AS status_envio,
                produtos.Id_prod_cliente AS id_produto
            FROM 
                pedidos
            JOIN 
                pedido_item ON pedidos.Id_Pedidos_Loji = pedido_item.Id_Pedidos_Loji
            JOIN 
                produtos ON pedido_item.Id_prod_cliente = produtos.Id_prod_cliente
            JOIN 
                cliente ON pedidos.id_Cliente = cliente.id_Cliente
            WHERE 
                produtos.id_Cliente = ? 
                AND pedido_item.localiza IS NULL;
        `;
    
        try {
            const [rows] = await pool.query(query, [id_Cliente]);
            callback(null, rows);
        } catch (err) {
            callback(err, null);
        }
    },
    

    contarVendasNaoEnviadas: async (id_Cliente) => {
        const query = `
            SELECT 
                COUNT(pedido_item.Id_prod_cliente) AS total_vendas_nao_enviadas
            FROM 
                pedidos
            JOIN 
                pedido_item ON pedidos.Id_Pedidos_Loji = pedido_item.Id_Pedidos_Loji
            JOIN 
                produtos ON pedido_item.Id_prod_cliente = produtos.Id_prod_cliente
            WHERE 
                produtos.id_Cliente = ? 
                AND pedido_item.localiza IS NULL;
        `;
        const [result] = await pool.query(query, [id_Cliente]);
        return result[0].total_vendas_nao_enviadas || 0;
    },

    atualizarMensagem: async (id_produto, localiza) => {
        const query = `
            UPDATE pedido_item
            SET localiza = ?
            WHERE Id_prod_cliente = ?`;
    
        try {
            const [results] = await pool.query(query, [localiza, id_produto]);
            return results;
        } catch (err) {
            throw err;
        }
    },

    
    contarVendasPorCliente: async (idCliente) => {
        try {
          const [resultados] = await pool.query(
            `SELECT COUNT(*) AS quantidadeVendas 
             FROM pedido_item pi
             INNER JOIN produtos p ON pi.Id_prod_cliente = p.id_prod_cliente
             WHERE p.id_Cliente = ? AND p.Stats = 'Disponível'`,
            [idCliente]
          );
          return resultados[0].quantidadeVendas;
        } catch (error) {
          console.log("Erro ao contar as vendas");
          return error;
        }
      },

}


module.exports = pedidoModel;