import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Viaggio } from '../modelli/viaggio.model';

@Injectable({
  providedIn: 'root'
})
export class ViaggioService {

  private apiUrl = 'http://localhost:3000/api/viaggi';

  constructor(private http: HttpClient) {}

  // recupera tutti i prodotti, eventualmente filtrati
  getViaggio(filtri?: any): Observable<Viaggio[]> {
    let params = new HttpParams();
    
    // Se ci sono filtri, aggiungili ai parametri
    if (filtri) {
      Object.keys(filtri).forEach(key => {
        if (filtri[key] !== undefined && filtri[key] !== '') {
          params = params.set(key, filtri[key]);
        }
      });
    }
    return this.http.get<Viaggio[]>(this.apiUrl, { params });
  }

  // recupera un viaggio tramite id
  getViaggioById(id: number): Observable<Viaggio> {
    return this.http.get<Viaggio>(`${this.apiUrl}/${id}`);
  }

  // crea nuovo 
  createViaggio(nuovoViaggio: Viaggio): Observable<Viaggio> {
    return this.http.post<Viaggio>(this.apiUrl, nuovoViaggio);
  }

  // aggiorna un viaggio (tutti i dati o quelli specificati)
  updateViaggio(id: number, aggiornamento: Partial<Viaggio>): Observable<{ messaggio: string }> {
    return this.http.put<{ messaggio: string }>(`${this.apiUrl}/${id}`, aggiornamento);
  }

  // blocca unViaggio cambiandone lo stato
  blockViaggio(id: number): Observable<{ messaggio: string }> {
    return this.http.put<{ messaggio: string }>(`${this.apiUrl}/${id}/stato`, null);
  }

  // aggiorna la quantità di un Viaggio
  updateQuantita(id: number, quantita: number): Observable<{ messaggio: string }> {
    return this.http.put<{ messaggio: string }>(`${this.apiUrl}/${id}/quantita`, { quantita });
  }

  // cerca prodotti usando il parametro 'search' del backend
  cercaViaggio(termineRicerca: string): Observable<Viaggio[]> {
    if (!termineRicerca.trim()) {
      return of([]); // ritorna un array vuoto se la ricerca è vuota
    }
    
    const filtri = { search: termineRicerca.trim() };
    return this.getViaggio(filtri);
  }
}