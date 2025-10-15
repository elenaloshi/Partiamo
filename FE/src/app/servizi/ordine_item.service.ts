import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrenotazioneItem } from '../modelli/prenotazione_item.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdineItemService {

  private apiUrl = 'http://localhost:3000/api/ordine_item';

  constructor(private http: HttpClient) {}

  // recupera gli item di un ordine specifico
  getItemsByOrdine(id_ordine: number): Observable<PrenotazioneItem[]> {
    return this.http.get<PrenotazioneItem[]>(`${this.apiUrl}/${id_ordine}`);
  }

  // aggiungi un item ad un ordine
  createOrdineItem(item: PrenotazioneItem): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }
}