const db = require('../service/db');

const findViaggio = async function (connection, filtri) {
    try {
        let sql = 'SELECT * FROM Viaggio';
        const params = [];
        const campi = Object.keys(filtri || {});
        let primoFiltro = true;

        for (let i = 0; i < campi.length; i++) {
            const chiave = campi[i];
            const valore = filtri[chiave];

            if (valore === undefined || valore === '') {
                continue;
            }

            sql += primoFiltro ? ' WHERE ' : ' AND ';

            if (chiave === 'search') {
                sql += '(stato_destinazione LIKE ? OR destinazione LIKE ? OR prezzo LIKE ?)';
                params.push(`%${valore}%`, `%${valore}%`, `%${valore}%`);
            } else {
                sql += `${chiave} = ?`;
                params.push(valore);
            }

            primoFiltro = false;
        }

        const rows = await db.execute(connection, sql, params);
        return rows ? rows : [];
    } catch (err) {
        console.log('Errore findViaggio [viaggioDAO]:', err.message);
        throw err;
    }
};

const findViaggioId = async function (connection, id_viaggio) {
    try {
        const sql = 'SELECT * FROM Viaggio WHERE id_viaggio = ?';
        const params = [id_viaggio];
        const rows = await db.execute(connection, sql, params);
        return rows ? rows : [];
    } catch (err) {
        console.log('Errore findViaggioId [viaggioDAO]:', err.message);
        throw err;
    }
};

const findViaggioOperator = async function (connection, id_operatore) {
    try {
        const sql = 'SELECT * FROM Viaggio WHERE id_operatore = ?';
        const params = [id_operatore];
        const rows = await db.execute(connection, sql, params);
        return rows ? rows : [];
    } catch (err) {
        console.log('Errore findViaggioOperator [viaggioDAO]:', err.message);
        throw err;
    }
};

const createViaggio = async function (connection, viaggio) {
    try {
        const sql = `INSERT INTO Viaggio
            (stato_destinazione, destinazione, titolo, partenza, ritorno, descrizione, prezzo, id_operatore, posti_disponibili, stato, categoria)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            viaggio.stato_destinazione,
            viaggio.destinazione,
            viaggio.titolo,
            viaggio.partenza,
            viaggio.ritorno,
            viaggio.descrizione,
            viaggio.prezzo,
            viaggio.id_operatore,
            viaggio.posti_disponibili,
            viaggio.stato,
            viaggio.categoria
        ];

        const result = await db.execute(connection, sql, params);
        if (!result || result.affectedRows === 0) {
            return null;
        }

        return { ...viaggio, id_viaggio: result.insertId };
    } catch (err) {
        console.log('Errore createViaggio [viaggioDAO]:', err.message);
        throw err;
    }
};

const aggiornaViaggio = async function (connection, id_viaggio, aggiornamenti) {
    try {
        const campi = Object.keys(aggiornamenti || {});
        if (campi.length === 0) {
            return null;
        }

        let sql = 'UPDATE Viaggio SET ';
        const params = [];

        campi.forEach((campo, index) => {
            sql += `${index > 0 ? ', ' : ''}${campo} = ?`;
            params.push(aggiornamenti[campo]);
        });

        sql += ' WHERE id_viaggio = ?';
        params.push(id_viaggio);

        const result = await db.execute(connection, sql, params);
        if (!result || result.affectedRows === 0) {
            return null;
        }

        return true;
    } catch (err) {
        console.log('Errore aggiornaViaggio [viaggioDAO]:', err.message);
        throw err;
    }
};

const viaggioSoldOut = async function (connection, id_viaggio) {
    try {
        const sql = 'UPDATE Viaggio SET stato = ? WHERE id_viaggio = ?';
        const params = ['passivo', id_viaggio];
        const result = await db.execute(connection, sql, params);

        if (!result || result.affectedRows === 0) {
            return null;
        }

        return true;
    } catch (err) {
        console.log('Errore viaggioSoldOut [viaggioDAO]:', err.message);
        throw err;
    }
};

const aggiornaPosti = async function (connection, id_viaggio, nPosti) {
    try {
        const sql = 'UPDATE Viaggio SET posti_disponibili = ? WHERE id_viaggio = ?';
        const params = [nPosti, id_viaggio];
        const result = await db.execute(connection, sql, params);

        if (!result || result.affectedRows === 0) {
            return null;
        }

        return true;
    } catch (err) {
        console.log('Errore aggiornaPosti [viaggioDAO]:', err.message);
        throw err;
    }
};

module.exports = {
    findViaggio,
    findViaggioId,
    findViaggioOperator,
    createViaggio,
    viaggioSoldOut,
    aggiornaViaggio,
    aggiornaPosti,
};
