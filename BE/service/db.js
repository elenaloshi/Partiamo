const mysql = require("mysql2/promise");
const config = require('../config');


async function  getConnection() {
    const connessione = await mysql.createConnection(config.db);
    console.log("connessione avvenuta");
    return connessione;
}

//Per utlizzare le query
async function execute(connection, sql, params) {
    const [results, fields] = await connection.execute(sql, params);
    return results;
}

module.exports={getConnection, execute};

