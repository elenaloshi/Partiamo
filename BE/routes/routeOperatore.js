const express= require('express');
const db= require ('../service/db');
const operatoreDAO = require('../dao/operatoreDAO');
const router= express.Router();



//crea utente
router.post('/operatori',async function (req,res) {

    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        
        const nuovoUtente = req.body;
        const result = await operatoreDAO.createOperatore(conn, nuovoUtente);

        if (!result){
            res.status(400).json({errore: 'impossibile creare operatore'});
        }else res.status(201).json(result);

        await conn.commit();

    } catch (err) {
        console.error('Errore in POST /operatori:', err.message);
        await conn.rollback();
        res.status(400).json({errore: err.message});
    }finally{
        await conn.close();
    }
})



//mostra operatori (con filtri)
router.get('/operatori', async function (req,res) {

    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const filtri = req.query;
        const operatori= await operatoreDAO.findOperatore(conn,filtri);
        res.json(operatori);
        await conn.commit();
    } catch (err) {
        console.error('Errore in GET /operatori:', err.message);
        await conn.rollback();
        res.status(500).json({errore: err.message});
    }finally{
        await conn.close();
    }
});

router.get('/operatori/:id',async function (req,res) {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const id = req.params.id;
        const rows= await operatoreDAO.findOperatoreId(conn,id);
        if (!rows || rows.length ===0 ){
            res.status(404).json({errore: 'utente non trovato'});
        }else res.status(200).json(rows[0]);

        await conn.commit();

    } catch (error) {
        console.error('Errore in GET /operatori/:id', error.message);
        await conn.rollback();
        res.status(500).json({errore: 'Errore interno del server'});
    }finally{
        await conn.close();
    }
    
});




module.exports= router;