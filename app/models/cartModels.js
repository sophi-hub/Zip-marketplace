const pool = require("../../config/pool_conexoes");

const cartModels = {



    findAllProductByUserId: async (userId) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM `Sacola` WHERE `id_Cliente` = ? ', [userId]);
            return linhas;
        } catch (error) {
            return error;
        }
    },

    addProducts: async (id, dataFav, userId, titulo, preco, img1) => {
        try {
            console.log("adicionou");
            const [linhas] = await pool.query('INSERT INTO `Sacola` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)', [id, dataFav, userId, titulo, preco, img1]);
            console.log(linhas);
            return linhas;
        } catch (error) {
            console.log(error)
            return error;
        }
    },

    hasProducts: async (userId, prodId) => {
        try {

            const [linhas] = await pool.query('SELECT * FROM `Sacola` WHERE `id_Cliente` = ? AND `Id_prod_cliente` = ? ', [userId, prodId]);
            return linhas.length >= 1 ;
        } catch (error) {
            return error;
        }
    }

    

};

module.exports = cartModels;