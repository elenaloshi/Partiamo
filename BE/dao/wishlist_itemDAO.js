const db = require ('../service/db');

const addItem = async function (connection,item){

    try {
        const sql = "INSERT INTO wishlist_item (id_wishlist,id_viaggio) VALUES (?, ? )";
        const params = [
            item.id_wishlist,
            item.id_viaggio
        ];
        const result = await db.execute(connection,sql,params);
        return result.affectedRows>0;
    } catch (err) {
        console.error("Errore in addItem: ", err.message);
        throw err;
    }
}


const removeItem = async function (connection,id_wishlist,id_viaggio) {
    try {
        const sql= "DELETE FROM wishlist_item WHERE id_wishlist =?  AND id_viaggio =? ";
        const params = [id_wishlist,id_viaggio];
        const result = await db.execute(connection,sql,params);
        return result.affectedRows>0;
    }
    catch (err) {
        console.error("Errore in removeItem:", err.message);
        throw err;
    }
}

const findWishlistItem = async function (connection,id_wishlist) {

    try {
        const sql = "SELECT * FROM wishlist_item WHERE id_wishlist=?";
        const params = [id_wishlist];

        const rows = await db.execute(connection, sql, params);

        return (!rows ? [] : rows);
    } catch (err) {
        console.error("Errore in findWishlistItem:", err.message);
    throw err;
    }
    
}



module.exports={
    addItem,
    removeItem,
    findWishlistItem
}