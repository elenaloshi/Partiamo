const db= require ('../service/db');

//crea operatore
const createOperatore= async function (connection,operatore){
    try {
        const sql= "INSERT INTO Operatore (nome, cognome, email) VALUES (?, ?, ?) ";
        params=[
            operatore.nome,
            operatore.cognome, 
            operatore.email
        ];
    
        const result = await db.execute(connection,sql,params);
    
        if (result.affectedRows == 0){
            return null;
        }else return {...operatore, id_operatore : result.insertId};
    
    } catch (err) {
        console.error("Errore creazione operatore",err.message);
        throw err;
    }
}

const findOperatore= async function (connection,filtri) {

    try {
        let sql = "SELECT * FROM Operatore ";
        const params=[];
        const campi=Object.keys(filtri);
    
        let primoFiltro= true;
    
        for (let i=0;i<campi.length;i++){
            const valore= filtri[campi[i]];
    
            if (valore===undefined || valore === '' ){
                continue;
            }
    
            sql += primoFiltro? ' WHERE ' : ' AND ';
            sql += campi[i] + ' = ? ';
            params.push(filtri[campi[i]]);
    
            primoFiltro=false;
        }
    
        const rows = await db.execute(connection,sql,params);
    
        return (rows? rows : []);
        
    } catch (err) {
        console.error("Errore in findOperatore:", err.message);
        throw err;
    }
}


//cerca operatore per id
const findOperatoreId = async function (connection,id_operatore) {
    try {
        const sql = "SELECT * FROM Operatore WHERE id_operatore = ? ";
        const params = [id_operatore];
        const rows = await db.execute(connection,sql,params);
        return (rows? rows:[]);
    } catch (err) {
        console.error("Errore findOperatoreId[DAO]",err.message);
        throw err;
    }
}


//cerca operatore per nome
const findOperatoreNome = async function (connection, nome) {
    try {
        const sql = "SELECT * FROM Operatore WHERE nome = ? ";
        const params = [nome];
        const rows = await db.execute(connection,sql,params);
        return (rows? rows:[]);
    } catch (err) {
        console.error("Errore findOperatoreNome [DAO]",err.message);
        throw err;
    }
}

//cerca operatore per cognome 
const findOperatoreCognome = async function (connection,cognome) {
    try {
        const sql = "SELECT * FROM Operatore WHERE cognome = ? ";
        const params = [cognome];
        const rows = await db.execute(connection,sql,params);
        return (rows? rows:[]);
    } catch (err) {
        console.error("Errore findOperatore Cognome [DAO]",err.message);
        throw err;
    }
}


module.exports ={
    findOperatore,
    createOperatore,
    findOperatoreId,
    findOperatoreNome,
    findOperatoreCognome
}



