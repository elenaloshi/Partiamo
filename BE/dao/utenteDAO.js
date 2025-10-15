const db = require('../service/db');
const wishlistDAO= require('../dao/wishlistDAO');

const createUtente = async function (connessione, utente) {
    try {
        const sql = "INSERT INTO Utente (nome, cognome, username, password, data_nascita, email, ruolo,stato) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
        const params = [
            utente.nome,
            utente.cognome,
            utente.username,
            utente.password,
            utente.data_nascita,
            utente.email,
            utente.ruolo,
            "attivo"
        ];

        const result = await db.execute(connessione, sql, params);

        //await wishlistDAO.createWishlist(connessione,id_utente);

        if (!result || result.affectedRows === 0) {
            return null;
        }else{

            const id= result.insertId;
            await wishlistDAO.createWishlist(connessione,id)
            return  { ...utente, id_utente: id };
        }
        
        
    
    } catch (err) {
        console.error('Errore creazione utente', err.message);
        throw err;
    }
};

const findUtenteId = async function (connessione, id_utente) {
    try {
        const sql = "SELECT * FROM Utente WHERE id_utente = ?";
        const params = [id_utente];
        const rows = await db.execute(connessione, sql, params);
        return rows ? rows : [];
    } catch (err) {
        console.error('Errore findUtenteId:', err.message);
        throw err;
    }
};

const findUtenteUsername = async function (connessione, username) {
    try {
        const sql = "SELECT * FROM Utente WHERE username = ?";
        const params = [username];
        const rows = await db.execute(connessione, sql, params);
        return rows && rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Errore findUtenteUsername:', err.message);
        throw err;
    }
};

const findUtenti = async function (connessione, filtri) {
    try {
        let sql = "SELECT * FROM Utente";
        const params = [];
        const campi = Object.keys(filtri || {});
        let primoFiltro = true;

        for (let i = 0; i < campi.length; i++) {
            const chiave = campi[i];
            const valore = filtri[chiave];

            if (valore === undefined || valore === '') {
                continue;
            }

            sql += primoFiltro ? " WHERE " : " AND ";
            sql += `${chiave} = ?`;
            params.push(valore);
            primoFiltro = false;
        }

        const rows = await db.execute(connessione, sql, params);
        return rows ? rows : [];
    } catch (err) {
        console.log('Errore findUtenti: ', err.message);
        throw err;
    }
};

const updateUtenteStato = async function(connection, id_utente, stato) {
    
    try {
        // aggoirno il valore dello stato per id_utente=?
        const sql = "UPDATE utente SET stato=? WHERE id_utente=?";
        const params = [stato, id_utente];

        const result = await db.execute(connection, sql, params);
        
        // ritorno true se è andato a buon fine, altrimenti false
        return(result.affectedRows > 0);
    
    } catch (err) {
    console.error("Errore in updateUtenteStato:", err.message);
    throw err;
  }
}


module.exports =
 { createUtente, 
    findUtenteId, 
    findUtenteUsername, 
    findUtenti ,
    updateUtenteStato
};

