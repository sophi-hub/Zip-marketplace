const pool = require("../../config/pool_conexoes");

minhasvendasModels = {

findEnviado: async (enviado) => {
    try {
        const [linhas] = await pool.query('SELECT * FROM `Minhas_Vendas` WHERE `enviado` = ? ', [enviado]);
        return linhas;
    } catch (error) {
        return error;
    }
},

};


module.exports = minhasvendasModels;