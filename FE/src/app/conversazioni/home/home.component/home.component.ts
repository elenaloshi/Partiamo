import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ViaggioService } from '../../../servizi/viaggio.service';
import { SessionService} from '../../../servizi/session.service';
import { Viaggio } from '../../../modelli/viaggio.model';
import { Utente } from '../../../modelli/utente.model';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  utenteLoggato: Utente | null = null;
  isAdmin : boolean = false;

  viaggiInTendenza : Viaggio[] =[];

  constructor(
    private viaggioService: ViaggioService,
    private sessionService: SessionService
  ){}

  ngOnInit(): void {
      //cerca utente che ha fatto il locg in
      this.sessionService.utenteLoggato$.subscribe({
        next: (utente)=>{
          this.utenteLoggato=utente;
          const ruolo = (utente?.ruolo ?? '').trim().toLowerCase();
          this.isAdmin = ruolo === 'amministratore' || ruolo === 'admin';

          if (!this.utenteLoggato || ruolo === 'cliente'){
            this.caricaViaggiTendenza();
          }

        }
      });
  }

  private caricaViaggiTendenza(): void {
    this.viaggioService.getViaggio({ stato: 'tendenza' }).subscribe({
      next: (prodotti) => {
        this.viaggiInTendenza = prodotti.filter(prodotto => prodotto.stato !== 'bloccato');
      },
      error: (err) => {
        console.error('Errore caricamento prodotti tendenza:', err);
        this.viaggiInTendenza = [];
      }
    });
  }

}
