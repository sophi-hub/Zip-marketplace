const pool = require("../../config/pool_conexoes");

const prodModels = {

    findAllProductByUserId: async (userId) => {
        try {
            const [linhas] = await pool.query(
                'SELECT * FROM `produtos` WHERE `id_Cliente` = ? AND `Stats` = "Disponível"', 
                [userId]
            );
            return linhas;
        } catch (error) {
            return error;
        }
    },

    
    findAllProduct: async (userId, produtoId) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM `produtos` WHERE `id_Cliente` = ? AND id_prod_cliente = ?', [userId, produtoId]);
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findAllProductByCategoryName: async (name) => {
        try {
            console.log(name)
            const [linhas] = await pool.query('SELECT * FROM `produtos` WHERE `cateProduto` = ? AND `Id_Bazar` IS NULL AND `Stats` = \'Disponivel\'', [name]);
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findProducts: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM `produtos`');
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findProdById: async (produtoId) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM `produtos` WHERE id_prod_cliente = ?', [produtoId]);
            return linhas
        } catch (err) {
            console.log(err);
        }
    },

    createProd: async (dadosForm) => {
        try {
            const [linhas] = await pool.query('INSERT INTO produtos SET ?', [dadosForm]);
            return linhas;
        } catch (error) {
            console.log(error);
            return error
        }
    },
    
    findBazarByUserId: async (UserId) => {
        try {
            const [linhas] = await pool.query("SELECT * FROM bazar WHERE id_Cliente = ?", [UserId])
            return linhas[0]
        } catch (error) {
            return error
        }
    },

    
    mostrarProdutosPerfil: async (UserIdProd) => {
        const [resultados] = await pool.query("SELECT * FROM produtos WHERE id_Cliente = ?", [UserIdProd])
        return resultados
    },

    mostrarProdutosBazar: async (userId, idBazar) => {
        const [resultados] = await pool.query(
            "SELECT * FROM produtos WHERE id_Cliente = ? AND Id_Bazar = ? AND Stats = 'Disponível'", [userId, idBazar]);
        return resultados;
    },

    findAllBazaarsWithProducts: async () => {
        try {
            const [result] = await pool.query(
                `SELECT bazar.*, produtos.* 
                FROM bazar
                LEFT JOIN produtos ON bazar.Id_Bazar = produtos.Id_Bazar AND produtos.Stats = 'Disponível'
                JOIN cliente ON bazar.id_Cliente = cliente.id_Cliente
                WHERE cliente.Stats = 'Ativo'`);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    acharPorTermo: async (termo) => {
        try {
            const [resultados] = await pool.query(
            "SELECT * FROM produtos WHERE (tituloprod LIKE ? OR preçoprod LIKE ?) AND Stats = 'Disponível'", [termo, termo]);
            return resultados;
        } catch (error) {
            console.log("Erro ao buscar produto");
            return error;
        }
    },


    findAllProductfav: async (userId) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM `Favoritos` WHERE `id_Cliente` = ?', [userId]);
            return linhas;
        } catch (error) {
            return error;
        }
    },


    hasProductsFav: async (userId, prodId) => {
        try {

            const [linhas] = await pool.query('SELECT * FROM `Favoritos` WHERE `id_Cliente` = ? AND `Id_prod_cliente` = ? ', [userId, prodId]);
            return linhas.length >= 1 ;
        } catch (error) {
            return error;
        }
    },


    countAvailableMaleProducts: async () => {
        const query = 
            `SELECT 
                COUNT(*) AS total_produtos_masculinos
            FROM 
                produtos
            WHERE 
                Stats = 'Disponível' 
                AND cateProduto = 'masculino'
                AND Id_Bazar IS NULL;`;
        
        const [result] = await pool.query(query);
        return result[0].total_produtos_masculinos || 0;
    },

    countAvailableFemaleProducts: async () => {
        const query = 
            `SELECT 
                COUNT(*) AS total_produtos_masculinos
            FROM 
                produtos
            WHERE 
                Stats = 'Disponível' 
                AND cateProduto = 'feminino'
                AND Id_Bazar IS NULL;`;
        
        const [result] = await pool.query(query);
        return result[0].total_produtos_masculinos || 0;
    },

    countAvailableChildProducts: async () => {
        const query = 
            `SELECT 
                COUNT(*) AS total_produtos_masculinos
            FROM 
                produtos
            WHERE 
                Stats = 'Disponível' 
                AND cateProduto = 'infantil'
                AND Id_Bazar IS NULL;`;
        
        const [result] = await pool.query(query);
        return result[0].total_produtos_masculinos || 0;
    },

    countAvailableLeftProducts: async () => {
        const query = 
            `SELECT 
                COUNT(*) AS total_produtos_masculinos
            FROM 
                produtos
            WHERE 
                Stats = 'Disponível' 
                AND cateProduto = 'acessorios'
                AND Id_Bazar IS NULL;`;
        
        const [result] = await pool.query(query);
        return result[0].total_produtos_masculinos || 0;
    },


};


module.exports = prodModels;