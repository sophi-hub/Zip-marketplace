const pool = require("../../config/pool_conexoes");

const models = {
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM (db_name)');
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findUserById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM cliente WHERE id_Cliente = ?',[id]);
            return linhas[0];
        } catch (error) {
            return error;
        }
    },

    findCampoCustom: async (criterioWhere) => {
        try{
            const [resultados] = await pool.query(
                "SELECT count(*) totalReg FROM cliente WHERE ?", 
                [criterioWhere]
            )
            console.log(resultados)
            return resultados[0].totalReg;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findUserEmail: async (emailForm) => {
        try {
            const [results] = await pool.query(
                "SELECT * FROM  CLIENTE  WHERE email = ?",
                [emailForm]
            );
            console.log(results);
            return results;
        } catch (e) {
            console.log(e);
        }
    },

    create: async (dadosForm) => {
        try {
            console.log(dadosForm)
            const [linhas, campos] = await pool.query('INSERT INTO (table_name) SET ?', [dadosForm]);
            console.log(linhas);
            console.log(campos);
            return linhas;
        } catch (error) {
            console.log(error);
            return null;
        }  
    },

    update: async (dadosForm, id) => {
        try {
            const [linhas] = await pool.query('UPDATE cliente SET ? WHERE id_Cliente = ?', [dadosForm, id]);
            return linhas;
        } catch (error) {
            return error;
        }  
    },

    delete: async (id) => {
        try {
            const [linhas] = await pool.query('DELETE FROM (table_name) WHERE (column_name) = ?', [id]);
            return linhas;
        } catch (error) {
            return error;
        }  
    },

    att: async (dadosForm, id) => {
        try {
            const [linhas] = await pool.query('UPDATE bazar SET ? WHERE id_Cliente = ?', [dadosForm, id]);
            return linhas;
        } catch (error) {
            return error;
        }  
    },



};
    
module.exports = models;