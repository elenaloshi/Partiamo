export interface Viaggio{
    id_viaggio: number;
    stato_destinazione: string;
    destinazione: string;
    titolo: string;
    partenza: string;
    ritorno: string;
    descrizione: string;
    prezzo: number;
    categoria: 'avventura' |'citta'|'mare'|'montagna' ;
    id_operatore:number;
    posti : number;
    stato: 'attivo' |'bloccato' |'tendenza';
}