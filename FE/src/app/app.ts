import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { Subscription } from 'rxjs';
import { SessionService } from './servizi/session.service';
import { Utente } from './modelli/utente.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, NgIf, NgForOf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'Partiamo';
  searchTerm = '';
  utenteLoggato: Utente | null = null;
  readonly currentYear = new Date().getFullYear();

  private sessionSub?: Subscription;

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  get isAdmin(): boolean {
    const ruolo = (this.utenteLoggato?.ruolo ?? '').trim().toLowerCase();
    return ruolo === 'amministratore' || ruolo === 'admin';
  }

  get isCliente(): boolean {
    const ruolo = (this.utenteLoggato?.ruolo ?? '').trim().toLowerCase();
    return ruolo === 'cliente';
  }

  ngOnInit(): void {
    this.sessionSub = this.sessionService.utenteLoggato$.subscribe(utente => {
      this.utenteLoggato = utente;
    });
  }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
  }

  cercaViaggi(): void {
    const termine = this.searchTerm.trim();
    if (!termine) {
      this.router.navigate(['/viaggi']);
      return;
    }
    this.router.navigate(['/viaggi'], { queryParams: { search: termine } });
  }

  vaiACategoria(categoria: string): void {
    this.router.navigate(['/viaggi'], { queryParams: { categoria } });
  }

  logout(): void {
    this.sessionService.clearLoggedUser();
    this.router.navigate(['/login']);
  }
}
