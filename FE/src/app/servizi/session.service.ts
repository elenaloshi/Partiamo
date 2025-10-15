import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utente } from '../modelli/utente.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  
  // BehaviorSubject per notificare cambiamenti utente
  private utenteLoggatoSubject = new BehaviorSubject<Utente | null>(null);
  public utenteLoggato$ = this.utenteLoggatoSubject.asObservable();

  constructor() {
    // Carica utente dal localStorage all'avvio
    this.caricaUtenteLoggato();
  }

  // Carica utente dal localStorage
  private caricaUtenteLoggato(): void {
    const raw = localStorage.getItem('utente');
    const utente = raw ? JSON.parse(raw) as Utente : null;
    this.utenteLoggatoSubject.next(utente);
  }

  // Restituisce l'utente loggato salvato in localStorage
  getLoggedUser(): Utente | null {
    return this.utenteLoggatoSubject.value;
  }

  // Salva l'utente loggato in localStorage dopo il login
  setLoggedUser(user: Utente): void {
    localStorage.setItem('utente', JSON.stringify(user));
    this.utenteLoggatoSubject.next(user);  // notifica i componenti se e cambiato
  }

  // Rimuove l'utente salvato in localStorage dopo il logout
  clearLoggedUser(): void {
    localStorage.removeItem('utente'); // pulisce storage
    this.utenteLoggatoSubject.next(null);  // pulisce il BehaviorSubject
    console.log('Logout effettuato, utente rimosso'); 
  }
}