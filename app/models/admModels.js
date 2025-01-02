const pool = require("../../config/pool_conexoes");

const admModel = {
    chamarPreFamosos: async () => {
        const [resultados] = await pool.query(
            "SELECT * FROM cliente WHERE Id_Tipo_Usuario = 1 AND Url_site IS NOT NULL AND Url_site != 'Negado' AND Stats = 'Ativo'");
        return resultados;
    },
    alterarTipoUsuario: async (tipoUsuario, idUsuario) =>{
        const [resultado] = await pool.query("UPDATE cliente SET Id_Tipo_Usuario = ? WHERE id_Cliente = ?", [tipoUsuario, idUsuario])
        return resultado
    },
    alterarUrl: async (url, idUsuario) =>{
        const [resultado] = await pool.query("UPDATE cliente SET Url_site = ? WHERE id_Cliente = ?", [url, idUsuario])
        return resultado
    },
}

module.exports = admModel