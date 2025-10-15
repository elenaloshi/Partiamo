const express = require ('express');
const db = require ('../service/db');
const prenotazioneDAO= require('../dao/prenotazioneDAO');
const router=express.Router();

//findPrenotazione
router.get('/prenotazioni', async function (req,res) {

    const conn= await  db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    try {

        const filtri = req.query;
        const prenotazioni= await prenotazioneDAO.findPrenotazione(conn,filtri);
        res.json(prenotazioni);
        await conn.commit();
        
    } catch (err) {
        console.error('Errore in GET /prenotazioni', err.message);
        await conn.rollback();
        res.status(500).json({errore: 'Errore nel recupero ordini'});
    }finally{
        await conn.close();
    }
});



router.post('/prenotazioni', async function (req,res) {
    
    const conn= await  db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const prenotazione=req.body;
        const result= await prenotazioneDAO.createPrenotazione(conn,prenotazione);
        
        if (!result){
            res.status(400).json({errore:'Prenotazione non creata'});
        }else res.status(201).json(result);
        
        await conn.commit();

    } catch (err) {

        console.error('Errore in POST /prenotazioni', err.message);
        await conn.rollback();
        res.status(500).json({errore: 'Errore nel recupero prenotazioni'});
    
    }finally{
        await conn.close();
    }
});

router.get ('/prenotazioni/:id', async function (req,res) {
    const conn = await db.getConnection();
    await  conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const id=req.params.id;
        const result = await prenotazioneDAO.findPrenotazineId(conn,id);

        if (!result){
            res.status(404).json({errore: 'Ordine non trovato'});
        }else res.json(result);

        await conn.commit();

        
    } catch (err) {

        console.error('Errore in GET /prenotazioni/:id', err.message);
        await conn.rollback();
        res.status(404).json({errore: 'Prenotazione non trovato'});
    
    }finally{
        await conn.close();
    }
});

router.get ('/prenotazioni/utente/:id', async function (req,res) {
    
    const conn = await db.getConnection();
    await  conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const id_utente = req.params.id;
        const result = await prenotazioneDAO.findPrenotazineUtente(conn,id_utente);

        if (!result){
            res.status(404).json({errore: 'Prenotazione non trovato'});
        }else res.json(result);

        await conn.commit();
        
    } catch (err) {

        console.error('Errore in GET /prenotazioni/utente/:id', err.message);
        await conn.rollback();
        res.status(404).json({errore: 'Prenotazione non trovato'});
        
    }finally{
        await conn.close();
    }
})


router.get ('/prenotazioni/viaggio/:id', async function (req,res) {
    
    const conn = await db.getConnection();
    await  conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const id_utente = req.params.id;
        const result = await prenotazioneDAO.findPrenotazineIdviaggio(conn,id_utente);

        if (!result){
            res.status(404).json({errore: 'Prenotazione non trovato'});
        }else res.json(result);

        await conn.commit();
        
    } catch (err) {

        console.error('Errore in GET /prenotazioni/viaggio/:id', err.message);
        await conn.rollback();
        res.status(404).json({errore: 'Prenotazione non trovato'});
        
    }finally{
        await conn.close();
    }
})






module.exports=router;