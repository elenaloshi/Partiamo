export interface Utente{
    id_utente?: number;
    nome: string;
    cognome: string;
    username: string;
    password: string;
    data_nascita: string;
    email: string;
    ruolo:'cliente'|'amministratore';
    stato: 'attivo' | 'bloccato'
}