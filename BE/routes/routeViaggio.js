const express = require('express');
const db = require('../service/db');
const viaggioDAO = require('../dao/viaggioDAO');

const router = express.Router();

router.get('/viaggi', async function (req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        res.setHeader('Content-Type', 'application/json');

        const filtri = req.query;
        const viaggi = await viaggioDAO.findViaggio(connection, filtri);
        await connection.commit();
        return res.json(viaggi);
    } catch (err) {
        console.error('Errore GET /viaggi:', err.message);
        if (connection) {
            await connection.rollback();
        }
        return res.status(500).json({ errore: 'Errore interno del server' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.get('/viaggi/:id', async function (req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        res.setHeader('Content-Type', 'application/json');

        const id = req.params.id;
        const row = await viaggioDAO.findViaggioId(connection, id);

        if (!row || !row[0]) {
            await connection.rollback();
            return res.status(404).json({ errore: 'Viaggio non trovato' });
        }

        await connection.commit();
        return res.status(200).json(row[0]);
    } catch (err) {
        console.error('Errore GET /viaggi/:id:', err.message);
        if (connection) {
            await connection.rollback();
        }
        return res.status(500).json({ errore: 'Errore interno del server' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.post('/viaggi', async function (req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        res.setHeader('Content-Type', 'application/json');

        const nuovoViaggio = req.body;
        const result = await viaggioDAO.createViaggio(connection, nuovoViaggio);

        if (!result) {
            await connection.rollback();
            return res.status(400).json({ errore: 'Impossibile creare viaggio' });
        }

        await connection.commit();
        return res.status(201).json(result);
    } catch (err) {
        console.error('Errore POST /viaggi:', err.message);
        if (connection) {
            await connection.rollback();
        }
        return res.status(500).json({ errore: 'Errore interno del server' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.put('/viaggi/:id', async function (req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        res.setHeader('Content-Type', 'application/json');

        const id = req.params.id;
        const aggiornamenti = req.body;
        const result = await viaggioDAO.aggiornaViaggio(connection, id, aggiornamenti);

        if (!result) {
            await connection.rollback();
            return res.status(400).json({ errore: 'Impossibile aggiornare viaggio' });
        }

        await connection.commit();
        return res.json({ messaggio: 'Viaggio aggiornato' });
    } catch (err) {
        console.error('Errore PUT /viaggi/:id:', err.message);
        if (connection) {
            await connection.rollback();
        }
        return res.status(500).json({ errore: 'Errore interno del server' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.put('/viaggi/:id/stato', async function (req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        res.setHeader('Content-Type', 'application/json');

        const id = req.params.id;
        const result = await viaggioDAO.viaggioSoldOut(connection, id);

        if (!result) {
            await connection.rollback();
            return res.status(400).json({ errore: 'Impossibile bloccare viaggio e renderlo sold out' });
        }

        await connection.commit();
        return res.json({ messaggio: 'Viaggio bloccato' });
    } catch (err) {
        console.error('Errore PUT /viaggi/:id/stato:', err.message);
        if (connection) {
            await connection.rollback();
        }
        return res.status(500).json({ errore: 'Errore interno del server' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.put('/viaggi/:id/nPosti', async function (req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        res.setHeader('Content-Type', 'application/json');

        const id = req.params.id;
        const nPosti = req.body.nPosti;
        const result = await viaggioDAO.aggiornaPosti(connection, id, nPosti);

        if (!result) {
            await connection.rollback();
            return res.status(400).json({ errore: 'Impossibile aggiornare i posti disponibili' });
        }

        await connection.commit();
        return res.json({ messaggio: 'Numero posti aggiornato' });
    } catch (err) {
        console.error('Errore PUT /viaggi/:id/nPosti:', err.message);
        if (connection) {
            await connection.rollback();
        }
        return res.status(500).json({ errore: 'Errore interno del server' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

module.exports = router;
