const pool = require("../../config/pool_conexoes");

const denunciasModels = {
    denunciarProd: async (dadosDenuncia) => {
        const query = 
            `INSERT INTO denuncias_produto 
            (id_prod_cliente, id_Cliente, repetido, fora_tema, ma_qualidade, data_denuncia)
            VALUES (?, ?, ?, ?, ?, NOW())`
        ;
    
        const values = [
            dadosDenuncia.id_prod_cliente,
            dadosDenuncia.id_Cliente,
            dadosDenuncia.repetido,
            dadosDenuncia.fora_tema,
            dadosDenuncia.ma_qualidade,
        ];
    
        return await pool.query(query, values);
    },

    denunciarVend: async (dadosDenunciaV) => {
        const query = 
            `INSERT INTO denuncias_vendedor
            (id_Cliente, id_Cliente_denunciado, fraude, produto_ilicito, propaganda_enganosa, data_denuncia)
            VALUES (?, ?, ?, ?, ?, NOW())`
        ;
    
        const values = [
            dadosDenunciaV.id_Cliente,
            dadosDenunciaV.id_Cliente_denunciado,
            dadosDenunciaV.fraude,
            dadosDenunciaV.produto_ilicito,
            dadosDenunciaV.propaganda_enganosa,
        ];
    
        return await pool.query(query, values);
    },

    listarDenuncias: async () => {
        const query = 
            `SELECT 
                dp.id_prod_cliente, 
                p.tituloProd,
                SUM(dp.repetido) AS total_repetido,
                SUM(dp.fora_tema) AS total_fora_tema,
                SUM(dp.ma_qualidade) AS total_ma_qualidade
            FROM 
                denuncias_produto dp
            JOIN 
                produtos p ON dp.id_prod_cliente = p.id_prod_cliente
            WHERE 
                p.Stats = 'Disponível'
            GROUP BY 
                dp.id_prod_cliente, p.tituloProd;`;
    
        const [denuncias] = await pool.query(query);
        return denuncias;
    },
    listarDenunciasVendedor: async () => {
        const query = `
            SELECT 
                d.id_Cliente_denunciado, 
                c.nome,
                SUM(d.fraude) AS total_fraude,
                SUM(d.produto_ilicito) AS total_produto_ilicito,
                SUM(d.propaganda_enganosa) AS total_propaganda_enganosa
            FROM 
                denuncias_vendedor d
            JOIN 
                cliente c ON d.id_Cliente_denunciado = c.id_Cliente
            WHERE 
                c.Stats != 'Inativo'
            GROUP BY 
                d.id_Cliente_denunciado, c.nome;
        `;
        const [denuncias] = await pool.query(query);
        return denuncias;
    },

    listarDenunciasUsu: async (userId) => {
        const query = 
            `SELECT 
                dp.id_prod_cliente, 
                SUM(dp.repetido) AS total_repetido,
                SUM(dp.fora_tema) AS total_fora_tema,
                SUM(dp.ma_qualidade) AS total_ma_qualidade,
                p.tituloprod AS nome_produto
            FROM 
                denuncias_produto dp
            JOIN 
                produtos p ON dp.id_prod_cliente = p.id_prod_cliente
            WHERE 
                p.id_Cliente = ? 
                AND p.Stats = 'Disponível'
            GROUP BY 
                dp.id_prod_cliente;`;
        
        const [denuncias] = await pool.query(query, [userId]);
        return denuncias;
    },

    contarDenunciasUsu: async (userId) => {
        const query = 
            `SELECT 
                COUNT(dp.id_prod_cliente) AS total_denuncias
            FROM 
                denuncias_produto dp
            JOIN 
                produtos p ON dp.id_prod_cliente = p.id_prod_cliente
            WHERE 
                p.id_Cliente = ? 
                AND p.Stats = 'Disponível';`;
        const [result] = await pool.query(query, [userId]);
        return result[0].total_denuncias || 0;
    },

    removerProdutoDenunciado: async (id_prod_cliente) => {
        const queryProduto = 'DELETE FROM `produtos` WHERE id_prod_cliente = ?';
        await pool.query(queryProduto, [id_prod_cliente]);
    },

}

module.exports = denunciasModels