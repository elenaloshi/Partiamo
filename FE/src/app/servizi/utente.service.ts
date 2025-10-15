import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utente } from '../modelli/utente.model';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  private apiUrl = 'http://localhost:3000/api/utenti'; //base URL per le chiamate API

  constructor(private http: HttpClient) {}

  // seleziona tutti gli utenti o filtra in base ai parametri forniti
  getUtenti(filtri?: any): Observable<Utente[]> {
    return this.http.get<Utente[]>(this.apiUrl, { params: filtri });
  }

  // seleziona un utente per ID
  getUtenteById(id: number): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/${id}`);
  }

  // login con username e password passati nel body POST
  // non salva l'utente, quello lo fa session nel localStorage
  login(username: string, password: string): Observable<{ messaggio: string, utente: Utente }> {
    return this.http.post<{ messaggio: string, utente: Utente }>(
      `${this.apiUrl}/login`,
      { username, password }
    );
  }

  // crea un nuovo utente con i dati nel body
  createUtente(nuovoUtente: Utente): Observable<Utente> {
    return this.http.post<Utente>(this.apiUrl, nuovoUtente);
  }

  // aggiorna lo stato dell'utente
  updateUtenteStato(id: number, stato: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/stato`, { stato });
  }
}
