const express = require('express');
const db = require ('../service/db');
const viaggioDAO = require('../dao/viaggioDAO');

const router = express.Router();

//findViaggio
router.get ('/viaggi',async function (req,res) {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type','application/jason');

    try {
         const filtri=req.query;
         const viaggio= await viaggioDAO.findViaggio(connection,filtri);
         res.json(viaggio); 
         await connection.commit();

    } catch (err) {
        console.error('errore GET/viaggi: ', err.message);
        await connection.rollback();
        res.status(400).json({ errore: err.message });
    }finally{
        await connection.close();
    }
});


//findeViaggioId
router.get('/viaggi/:id', async function (req,res) {
    const connection= await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const id=req.params.id;
        const row = await viaggioDAO.findViaggioId(connection,id);
        if (!row || !row[0]){
            res.status(404).json({ errore: 'Viaggio non trovato' });
        } else {
            res.status(200).json(row[0]);
        }

        await connection.commit();

    } catch (err) {
        console.error('errore GET/viaggi/:id ', err.message);
        await connection.rollback();
        res.status(400).json({ errore: 'Errore server' });
    }finally{
        await connection.close();
    }
});


//creazione prodotto
router.post('/viaggi', async function (req,res) {
    const connection= await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    
    try {
        
        const nuovoViaggio = req.body;
        const result = await viaggioDAO.createViaggio(connection,nuovoViaggio);

        if (!result){
            await connection.rollback();
            return res.status(400).json({ errore: 'impossibile creare viaggio' });
        }else res.status(201).json(result);

        await connection.commit();

    } catch (err) {
        await connection.rollback();
        console.error('Errore in POST /viaggi:', err.message);
        res.status(500).json({errore: 'Errore interno del server'});
        
    } finally{
        await connection.close();
    }
});


router.put('/viaggi/:id', async function (req,res) {
    const connection= db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {

        const id = req.params.id;
        const aggiornamenti=req.body;
        const result = await viaggioDAO.aggiornaViaggio(connection,id,aggiornamenti);
        

        if (!result){
            await connection.rollback();
            return res.status(400).json({ errore: 'impossibile aggiornare viaggio' });
        } else res.json({messagio: 'Prodotto aggiornato'});

        await connection.commit();

    } catch (error) {

        console.error('Errore in PUT /viaggi:', err.message);
        await connection.rollback();
        res.status(500).json({errore: 'Errore interno del server'});

    }finally{
        await connection.close();
    }
});


//aggirna stato-> viaggio soldOut 
router.put('/viaggi/:id/stato', async function (req,res) {

    const connection= await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        
        const id= req.params.id;
        const result = await viaggioDAO.viaggioSoldOut(connection,id);

        if (!result){
            await connection.rollback();
            return res.status(400).json({ errore: 'impossibile bloccare viaggio e renderlo soldOut' });
        } else res.json({messagio: 'Prodotto Bloccato'});

        res.status(201).json(result);
        await connection.commit();

    } catch (err) {
        console.error('Errore in PUT /viaggi/:id', err.message);
        await connection.rollback();
        res.status(500).json({errore: 'Errore interno del server'});
    }finally{
        await connection.close();
    }
});


//aggiorna posti disponibili 

router.put('/viaggi/:id/nPosti', async function (req,res) {

    const connection= await db.getConnection();
    await connection.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const id=req.params.id;
        const nPosti= req.body.nPosti;
        const result = await viaggioDAO.aggiornaPosti(connection,id,nPosti);

        if (!result){
            return res.status(400).json({ errore: 'impossibile aggiornare posti' });
        } else res.json({messagio: 'Numero Posti oggiornato'});

        await connection.commit();
        
    } catch (err) {
        console.error('Errore in PUT /viaggi/:id/nPosti', err.message);
        await connection.rollback();
        res.status(500).json({errore: 'Errore interno del server'});
    }finally{
        await connection.close();
    }
});


module.exports=router;

