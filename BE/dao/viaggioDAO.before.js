const db= require('../service/db');


const findViaggio= async function (connection,filtri) {
    try {
        let sql = "SELECT * FROM Viaggio";
        const params=[];

        const campi = Object.keys(filtri);
        let primoFiltro=true;

        for (let i=0;i<campi.length;i++){
            const valore= filtri[campi[i]];
            if (valore === undefined || valore===''){
                continue;
            }
            sql += primoFiltro ? " WHERE " : " AND " ;

            if (campi[i]==='search'){
                sql += "(stato_destinazione LIKE ? OR destinazione LIKE ? OR prezzo LIKE ?) ";
                params.push(`%${valore}%`,`%${valore}%`,`%${valore}%`);
            }else {
                sql += campi[i]+ " = ?";
                params.push(filtri[campi[i]]);
            }
            primoFiltro=false;
        }

        const rows = await db.execute(connection,sql, params);
        return (rows ? rows : []);

    } catch (err) {
        console.log("Errore findeViaggio[viaggioDAO]: ",err.message);
        throw err;  
    }
}

const findViaggioId = async function (connection,id_viaggio) {

    try {
        const sql = "SELECT * FROM Viaggio WHERE id_viaggio =?";
        const params = [id_viaggio];
        const rows = await db.execute(connection,sql,params);
        return (rows ? rows : []); 
    
    } catch (err) {
        console.log("Errore findeViggioId [viaggioDAO]: ",err.message);
        throw err;
    }
};

const findViaggioOperator= async function (connection,id_operatore){
   try {
        const sql = "SELECT * FROM Viaggio WHERE id_operatore = ? ";
        const params=[id_operatore];
        const rows= await db.execute(connection,sql,params);
        return (rows ? rows : []);
   } catch (err) {
        console.log("Errore findViaggioOperator [viaggioDAO]: ",err.message);
        throw err;
   }
}

const createViaggio = async function (connection, viaggio) {
    try {

        const sql = "INSERT INTO Viaggio (id_viaggio, stato_destinazione, destinazione, titolo,  partenza, ritorno, descrizione, prezzo,id_operatore,posti_disponibili,stato) VALUES (?,?,?,?,?,?,?,?,?,?,?)" ;
        const params =[
            viaggio.id_viaggio,
            viaggio.stato_destinazione,
            viaggio.destinazione,
            viaggio.titolo,
            viaggio.partenza,
            viaggio.ritorno, 
            viaggio.descrizione,
            viaggio.prezzo,
            viaggio.id_operatore,
            viaggio.posti_disponibili,
            viaggio.stato
        ];
        const result= await db.execute(connection,sql,params);
        if (!result || result.affectedRows===0){
            return null;
        }else return {...viaggio,id_viaggio : result.insertId};

    } catch (err) {
        console.log("Errore createViaggio [viaggioDAO]: ",err.message);
        throw err;
    }
}

const aggiornaViaggio= async function (connection,id_viaggio,aggiornamenti){
   try {
     const sql= "UPDATE Viaggio SET ";
     const campi = Object.keys(aggiornamenti);
     const params=[];

     for (let i=0;i<campi.length;i++){
        sql += (i>0 ? "," : ""  )+ campi[i]+"= ?";
        params.push(filtri[campi[i]]);
     }
     
     sql += " WHERE id_viaggio =?";
     params.push(id_viaggio);

     const result = await db.execute(connection,sql,params);

     if (!result || result.affectedRows=== 0){
        return null;}

     return result.affectedRows>0;

   } catch (err) {
    console.log("Errore aggiornaViaggio [viaggioDAO]: ",err.message);
    throw err;
   }
}

const viaggioSoldOut = async function (connection,id_viaggio) {
    try {
        const sql = "UPDATE Viaggio SET stato =? WHERE id_viaggio =?";
        const params =['bloccato',id_viaggio];
        const result = await db.execute(connection,sql,params);
        if (!result || result.affectedRows===0){
            return null;
        }else return result.affectedRows>0;

    } catch (err) {
        console.log("Errore viaggioSoldOut [viaggioDAO]: ",err.message);
        throw err;
    }
}

const aggiornaPosti = async function (connection,id_viaggio,nPosti) {
    try {
        const sql = "UPDATE Viaggio SET posti_disponibili=? WHERE id_viaggio=?";
        const params=[nPosti,id_viaggio];
        const result= await db.execute(connection,sql,params);

        if (!result || result.effectedRows === 0){
            return null;
        }else return result.affectedRows>0;
        
    } catch (err) {
        console.log("Errore aggiornaPosti [viaggioDAO]: ",err.message);
        throw err;
    }
}



module.exports={findViaggio,findViaggioId,findViaggioOperator,createViaggio,viaggioSoldOut,aggiornaViaggio,aggiornaPosti}
