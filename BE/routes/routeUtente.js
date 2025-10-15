const express = require('express');
const db = require('../service/db');
const utenteDAO = require('../dao/utenteDAO');

const router = express.Router();

// GET /api/utenti
router.get('/utenti', async function (req, res) {
    const connessione = await db.getConnection();
    await connessione.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const filtri = req.query;
        const utenti = await utenteDAO.findUtenti(connessione, filtri);
        res.json(utenti);
        await connessione.commit();
    } catch (err) {
        console.error('errore GET/utenti: ', err.message);
        await connessione.rollback();
        res.status(400).json({ errore: err.message });
    } finally {
        await connessione.close();
    }
});

// GET /api/utenti/:id
router.get('/utenti/:id', async function (req, res) {
    const connessione = await db.getConnection();
    await connessione.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const id = req.params.id;
        const row = await utenteDAO.findUtenteId(connessione, id);

        if (!row || !row[0]) {
            res.status(404).json({ errore: 'utente non trovato' });
        } else {
            res.status(200).json(row[0]);
        }

        await connessione.commit();
    } catch (err) {
        console.error('Errore in GET /utenti/:id', err.message);
        await connessione.rollback();
        res.status(500).json({ errore: 'Errore interno al server' });
    } finally {
        await connessione.close();
    }
});

// POST /api/utenti/login
router.post('/utenti/login', async function (req, res) {
    const connessione = await db.getConnection();
    await connessione.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const { username, password } = req.body;
        console.log('Login per username: ', username);

        if (!username || !password) {
            await connessione.rollback();
            return res.status(400).json({ errore: 'Password e username sono richiesti' });
        }

        const utente = await utenteDAO.findUtenteUsername(connessione, username);
        console.log('Utente trovato: ', utente ? 'Si' : 'No');

        if (!utente) {
            await connessione.rollback();
            return res.status(401).json({ errore: 'Utente non trovato' });
        }

        if (utente.password !== password) {
            await connessione.rollback();
            return res.status(401).json({ errore: 'Password errata' });
        }

        await connessione.commit();
        res.status(200).json({ messaggio: 'login effettuato', utente });
    } catch (err) {
        console.log('Errore login', err.message, err.stack);
        await connessione.rollback();
        res.status(500).json({ errore: 'Errore durante il login' });
    } finally {
        await connessione.close();
    }
});

// POST /api/utenti
router.post('/utenti', async function (req, res) {
    const connessione = await db.getConnection();
    await connessione.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const nuovoUtente = req.body;
        const result = await utenteDAO.createUtente(connessione, nuovoUtente);

        if (!result) {
            await connessione.rollback();
            return res.status(400).json({ errore: 'impossibile creare utente' });
        }

        await connessione.commit();
        res.status(201).json(result);
    } catch (err) {
        console.error('Errore in POST /utenti:', err.message);
        await connessione.rollback();
        res.status(500).json({ errore: 'Errore interno del server' });
    } finally {
        await connessione.close();
    }
});


router.put('/utenti/:id/stato', async function(req, res) {
    const connessione = await db.getConnection();
    await connessione.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try{
        //id si trova nell'URL mentre stato si trova in JSON
        const id_utente = req.params.id;
        const stato = req.body.stato;

        const result = await utenteDAO.updateUtenteStato(conn, id_utente, stato);

        if(!result) {
            res.status(404).json({errore: 'Utente non trovato o stato non aggiornato'});
        } else {
            res.status(200).json({message: 'Utente aggiornato'});
        }

        await connessione.commit();
    } catch (err) {
        console.error('Errore in PUT /utenti/:id/stato:', err.message);
        await connessione.rollback();
        res.status(500).json({errore: 'Errore interno del server'});
    } finally {
        await connessione.close();
    }
});

module.exports = router;

