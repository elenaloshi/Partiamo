import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WishlistItem } from '../modelli/wishlist_item.model';

@Injectable({ providedIn: 'root' })
export class WishlistItemService {

  private apiUrl = 'http://localhost:3000/api/wishlist_item';

  constructor(private http: HttpClient) {}

  // 1. Recupera tutti gli item di una wishlist
  getItems(id_wishlist: number): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/${id_wishlist}`);
  }

  // 2. Aggiunge un item alla wishlist
  addItem(item: WishlistItem): Observable<any> {
    return this.http.post(`${this.apiUrl}`, item);
  }

  // 3. Rimuove un item dalla wishlist
  removeItem(id_wishlist: number, id_prodotto: number): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}`, {
      body: { id_wishlist, id_prodotto }
    });
  }
}