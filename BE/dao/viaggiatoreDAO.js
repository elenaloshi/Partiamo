const { param } = require('../routes/routeOperatore');
const db= require ('../service/db');

const createViaggiatore= async function (connection,viaggiatore) {
    try {
        
        const sql = `INSERT INTO Viaggiatore (nome, cognome, data_di_nascita, carta_identita, passaporto, id_prenotazione)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const params=[
            viaggiatore.nome,
            viaggiatore.cognome,
            viaggiatore.data_di_nascita,
            viaggiatore.carta_identita,
            viaggiatore.passaporto,
            viaggiatore.id_prenotazione
        ];
        
        const result = await db.execute(connection,sql,params);

        if (result.affectedRows ===0){
            
            return null;

        } else return {...viaggiatore, id_viaggiatore : result.insertId };

    } catch (err) {
        console.error("Errore creazione viaggiatore ",err.message);
        throw err;
    }
}

const findeViaggiatore= async function (connection,filtri) {
    try {

        let sql= "SELECT * FROM Viaggiatore ";
        const params=[];
        const campi= Object.keys(filtri);
        let primoFiltro= true;

        for (let i=0;i<campi.length;i++){
            const valore=filtri[campi[i]];
            if (valore=== undefined||valore===''){
                continue;
            }

            sql += primoFiltro? " WHERE ": " AND ";
            sql += campi[i] +" = ? ";
            params.push(filtri[campi[i]]);

            primoFiltro=false;
        }

        const rows =await db.execute(connection,sql,params);
        return (rows? rows:[]);

    } catch (err) {
        console.error("Errore in findViaggiatore [dao]:", err.message);
        throw err;
    }
}


const findeViaggiatorId = async function (connection,id_viaggiatore) {
    try {
        const sql= "SELECT * FROM Viaggiatore WHERE id_viaggiatore = ? ";
        const params=[id_viaggiatore];
        const rows = await db.execute(connection,sql,params);

        return (rows? rows:[]);

    } catch (err) {
        console.error("Errore findViaggiatoreId [DAO]",err.message);
        throw err;
    }
} 


module.exports={
    createViaggiatore,
    findeViaggiatorId,
    findeViaggiatore
}