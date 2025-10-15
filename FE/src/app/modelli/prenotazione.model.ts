export interface Prenotazione{
    id_prenotazione : number;
    data_prenotazione: string;
    num_persone: number;
    id_utente: number;
    id_viaggio : number;
    prezzoTotale: number;
}