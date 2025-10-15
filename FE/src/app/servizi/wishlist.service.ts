import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Wishlist } from '../modelli/wishlist.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {

  private apiUrl = 'http://localhost:3000/api/wishlist';

  constructor(private http: HttpClient) {}

  // Recupera la wishlist di un utente dato il suo ID
  getWishlistByUtente(id_utente: number): Observable<Wishlist[]> {
    return this.http.get<any>(`${this.apiUrl}/utente/${id_utente}`);
  }

  // Crea una nuova wishlist per un utente
  createWishlist(id_utente: number): Observable<Wishlist> {
    return this.http.post<Wishlist>(this.apiUrl, { id_utente });
  }
}