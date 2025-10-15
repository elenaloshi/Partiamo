const express =require('express');
const db= require ('../service/db');
const wishlistDAO = require('../dao/wishlistDAO');
const router=express.Router();

router.get('/wishlist/utente/:id',async function (req,res) {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const id_utente= req.params.id;
        const result= await wishlistDAO.findWishlistUtente(conn,id_utente);

        if (!result){
            res.status(404).json({ errore: 'Nessuna wishlist trovata' });
        }else {
            res.json(result);
        }
        
    } catch (err) {
        console.error('Errore in GET /wishlist/utente/:id', err.message);
        await conn.rollback();
        res.status(500).json({ errore: 'Errore nel recupero della wishlist'});
    }finally{
        await conn.close();
    }
});




module.exports=router;