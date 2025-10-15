const express= require('express');
const db= require ('../service/db');
const viaggiatoreDAO = require('../dao/viaggiatoreDAO');
const router= express.Router();

//crea viaggiatore

router.post ('/viaggiatore', async function (req,res) {

    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {

        const nuovoViaggiatore=req.body;
        const result = await viaggiatoreDAO.createViaggiatore(conn,nuovoViaggiatore);

        if (!result){
            res.status(400).json({errore: 'impossibile creare viaggiatore'});
        }else res.status(201).json(result);

        await conn.commit();

    } catch (err) {

        console.error('Errore in POST /viaggiatore:', err.message);
        await conn.rollback();
        res.status(400).json({errore: err.message});

    }finally{
        await conn.close();
    }  
})



//mostra viaggiatore (filtri)
router.get('/viaggiatore',async function (req,res) {
    
    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {

        const filtri=req.query;
        const viaggiatori = await viaggiatoreDAO.findeViaggiatore(conn,filtri);
        res.json(viaggiatori);
        await conn.commit();

    } catch (err) {

        console.error('Errore in GET /viaggiatori:', err.message);
        await conn.rollback();
        res.status(500).json({errore: err.message});
    
    }finally{
        await conn.close();
    }
})





//mostra viaggiatore id
router.get('/viaggiatore/:id', async function (req,res) {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const id= req.params.id;
        const rows = await viaggiatoreDAO.findeViaggiatorId(conn,id);
        
        if (!rows || rows.length ===0){
            res.status(404).json({errore: 'viaggiatore non trovato'});
        }else res.status(200).json(rows[0]);

        await conn.commit();
        
    } catch (err) {
        
        console.error('Errore in GET /viaggiatore/:id', err.message);
        await conn.rollback();
        res.status(500).json({errore: 'Errore interno del server'});

    }finally{
        await conn.close();
    }
    
})


module.exports=router;
