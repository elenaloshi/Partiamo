const db= require('../service/db');

//creazine wishlisy
const createWishlist = async function(connection,id_utente){
    try {
        const sql= "INSERT INTO Wishlist (id_utente) VALUES (?)";
        const params = [id_utente];
    
    
        const result = await db.execute(connection,sql,params);


        if (result.affectedRows==0 ){
            return null;
        }else return {id_utente, id_wishlist: result.insertId};
    } catch (err) {
        console.error("Errore creazione operatore",err.message);
        throw err;
    }
}


const findWishlistUtente = async function (connection,id_utente) {
    try {
        const sql = "SELECT * FROM Wishlist WHERE id_utente =? ";
        const params = [id_utente];
        const rows = await db.execute(connection,sql,params);
    
        return (rows.length ? rows[0]:null);
    } catch (err) {
        console.error("Errore in findWishlistUtente:", err.message);
        throw err;
    }
};



module.exports={createWishlist,findWishlistUtente};