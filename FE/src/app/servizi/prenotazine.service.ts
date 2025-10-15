import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Viaggio } from '../modelli/viaggio.model';
import { Observable } from 'rxjs';
import { Prenotazione } from '../modelli/prenotazione.model';


@Injectable({ providedIn: 'root' })
export class PrenotazioneService {

  private apiUrl = 'http://localhost:3000/api/prenotazioni';

  constructor(private http: HttpClient) {}

  // recupera tutti gli oridni, con possibilità di filtri
  getPrenotazione(filtri?: any): Observable<Prenotazione[]> {
    const params = filtri ? filtri : {};
    return this.http.get<Prenotazione[]>(this.apiUrl, { params });
  }

  // recupera un viaggio per ID
  getPrenotazioneById(id: number): Observable<Prenotazione> {
    return this.http.get<Prenotazione>(`${this.apiUrl}/${id}`);
  }

  // recupera gli ordini di un utente 
  getPrenotazioneByUtente(id_utente: number): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/utente/${id_utente}`);
  }

  // crea un nuovo viaggio
  creaPrenotazione(viaggio: Prenotazione): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(this.apiUrl, viaggio);
  }

  // aggiorna lo stato di un viaggi 
  aggiornaStatoPrenotazione(id: number, stato: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/stato`, { stato });
  }
}