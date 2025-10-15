const db= require ('../service/db');



const findPrenotazione = async function (connection, filtri) {
    
    try {
        let sql = "SELECT * FROM Prenotazione ";
        const params =[];
        const campi= Object.keys(filtri ||{});//Object.keys prend e un oggetto, se filtri non è un oggetto non funziona
                                              //e si risolve con(filtri ||{}), se filtri esiste usa filtri,a ltrimenti restituisce l'oggetto vuoto{}
        let primoFiltro = true;
    
        for (let i=0;i<campi.length;i++){
            //const chiave=campi[i];
            const valore= filtri[campi[i]];
    
            if (valore === undefined || valore === ''){
                continue;
            }
    
            sql+= primoFiltro? "WHERE " : "AND ";
            sql += campi[i]+" = ? ";
            params.push(filtri[campi[i]])
            primoFiltro=false;
        }
    
        const rows = await db.execute(connection,sql,params);
        return (rows? rows:[]);
    } catch (err) {
        console.log('Errore findPrenotazine [prenotazioneDAO]:', err.message);
        throw err;
    }
};

//crea ordine
const createPrenotazione = async function(connection,prenotazione){

    try {
        const sql =`INSERT INTO Prenotazione (data_prenotazione, num_persone, id_utente, id_viaggio, prezzoTotale)
                    VALUES (NOW(), ?, ?, ?, ?)`;
        const params =[
            prenotazione.num_persone,
            prenotazione.id_utente,
            prenotazione.id_viaggio,
            prenotazione.prezzoTotale
        ];

        const result = await db.execute (connection,sql,params);

        if (result.affectedRows ==0){
            return null;
        } else return {...prenotazione, id_prenotazione: result.insertId}; //...prenotazione: crea una copia di tutte le prorpietà dell'intero oggetto prenotazione
        //id_prenotazione: result.insertId -> aggiunge/sovrascrive la proprietà id_prenotazione con il valore di result.insertId (id generato automaticamnere dal db)
   
    } catch (err) {
        console.log("Errore creazione prenotazione: ",err.message);
        throw err;
    }
}

//recupera prenotazione da id
const findPrenotazineId = async function (connection,id_prenotazione) {

    try {
        const sql= "SELECT * FROM Prenotazione WHERE id_prenotazione = ? ";
        const params = [id_prenotazione];
        const rows = await db.execute(connection,sql,params);

        return (rows ? rows : []);
    } catch (err) {
        console.error("Errore in findPrenotazineId [prenotazioneDAO]:", err.message);
        throw err;
    }
   
}

//recuper aprenotazione da utente
const findPrenotazineUtente = async function  (connection,id_utente) {
    try {
        const sql = "SELECT * FROM Prenotazione WHERE id_utente = ?"
        const params = [id_utente];
        const rows= await db.execute(connection,sql,params);
        
        return (rows? rows : []);

    } catch (err) {
        console.error("Errore in findPrenotazineUtente [prenotazioneDAO]:", err.message);
        throw err;
    }
}


const findPrenotazineIdviaggio = async function  (connection,id_viaggio) {
    try {
        const sql = "SELECT * FROM Prenotazione WHERE id_viaggio = ?"
        const params = [id_viaggio];
        const rows= await db.execute(connection,sql,params);
        
        return (rows? rows : []);

    } catch (err) {
        console.error("Errore in findPrenotazineIdViaggio [prenotazioneDAO]:", err.message);
        throw err;
    }
}



module.exports={
   findPrenotazione,
   createPrenotazione,
   findPrenotazineId,
   findPrenotazineUtente,
   findPrenotazineIdviaggio
};