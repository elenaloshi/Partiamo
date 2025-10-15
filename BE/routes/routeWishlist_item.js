const express = require('express');
const db = require('../service/db');
const wishlist_itemDao = require('../dao/wishlist_itemDAO');

const router = express.Router();

// mostra gli item in una wishlist
router.get('/wishlist_item/:id_wishlist', async function(req, res) {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');
    
    try {
        const id_wishlist = req.params.id_wishlist;
        const result = await wishlist_itemDao.findWishlistItem(conn, id_wishlist);

        if (!result || result.length === 0) {
            res.status(404).json({ errore: 'Nessun item trovato per questa wishlist' });
        } else {
            res.json(result);
        }

        await conn.commit();

    } catch (err) {
        console.error('Errore in GET /wishlist-item/:id_wishlist', err.message);
        await conn.rollback();
        res.status(500).json({ errore: 'Errore nel recupero item' });
    } finally {
        await conn.close();
    }
});

// aggiunge un item alla wishlist
router.post('/wishlist_item', async function(req, res) {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const item = req.body;
        const result = await wishlist_itemDao.addItem(conn, item);

        if (!result) {
            res.status(400).json({ errore: 'Impossibile inserire item nella wishlist' });
        } else {
            res.status(201).json({ messaggio: 'Item inserito con successo' });
        }

        await conn.commit();

    } catch (err) {
        console.error('Errore in POST /wishlist-item', err.message);
        await conn.rollback();
        res.status(500).json({ errore: 'Errore nel server' });
    } finally {
        await conn.close();
    }
});

// rimuove un item dalla wishlist
router.delete('/wishlist_item', async function(req, res) {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    res.setHeader('Content-Type', 'application/json');

    try {
        const { id_wishlist, id_viaggio } = req.body;
        const result = await wishlist_itemDao.removeItem(conn, id_wishlist, id_viaggio);

        if (!result) {
            res.status(400).json({ errore: 'Item non rimosso' });
        } else {
            res.json({ messaggio: 'Item rimosso con successo' });
        }

        await conn.commit();

    } catch (err) {
        console.error('Errore in DELETE /wishlist-item', err.message);
        await conn.rollback();
        res.status(500).json({ errore: 'Errore nel server' });
    } finally {
        await conn.close();
    }
});

module.exports = router;
