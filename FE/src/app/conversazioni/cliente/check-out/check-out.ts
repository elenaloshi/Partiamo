import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarrelloService, CarrelloItem } from '../../../servizi/carrello.service';
import { OrdineItemService } from '../../../servizi/ordine_item.service';
import { PrenotazioneService } from '../../../servizi/prenotazine.service'; 
import { ViaggioService } from '../../../servizi/viaggio.service';  
import { SessionService } from '../../../servizi/session.service';
import { Utente } from '../../../modelli/utente.model';

@Component({
  selector: 'app-check-out',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-out.html',
  styleUrl: './check-out.css'
})
export class CheckOut implements OnInit {
  carrelloItems: CarrelloItem[]=[];
  utenteLoggato: Utente |null=null;

  indirizzo:string='';
  numeroCartaCredito: string='';
  scadenzaCarta: string = '';
  cvv: string = '';
  
 
  messaggio: string = '';
  errore: string = '';

  constructor(
    private carrelloService: CarrelloService,
    private prenotazioneService: PrenotazioneService,
    private ordineItemService: OrdineItemService,
    private viaggioService: ViaggioService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.utenteLoggato=this.sessionService.getLoggedUser();
      this.carrelloItems=this.carrelloService.getItems();
  }

  get totaleOrdine(): number{
    let totale=0;
    for(let item  of this.carrelloItems){
      totale+=item.PU*item.quantita;
    }
    return totale;
  }

  get idViaggio():number{
    let id=0;
    for (let item of this.carrelloItems){
      id= item.id_viaggio;
    }
    return id;
  }

  
  creaOrdine(): void {
    
    if (!this.utenteLoggato) {
      this.errore = 'Devi effettuare il login prima di completare l’ordine';
      return;
    }


    const idUtente = this.utenteLoggato.id_utente;
    if (idUtente == null) {
      this.errore = 'Utente non valido';
      return;
    }

    const numeroPersone = this.carrelloItems.reduce((totale, item) => totale + item.quantita, 0);
    const nuovoOrdine={
      id_prenotazione : 0,
      data_prenotazione: new Date().toISOString(),
      num_persone: numeroPersone,
      id_utente: idUtente,
      id_viaggio : this.idViaggio,
      prezzoTotale: this.totaleOrdine
    };

    this.prenotazioneService.creaPrenotazione(nuovoOrdine).subscribe({
      next: (prenotazioneCreata)=>{
        this.aggiungiPrenotazione(prenotazioneCreata.id_prenotazione);
      },
      error:(err)=>{
        console.error("Errore creazione oridne",err);
        this.errore='Errore creazione ordine';
      }
    });
  }

  aggiungiPrenotazione (idOrdine: number):void{
    let itemProcessati=0;
    for(let item of this.carrelloItems ){

      const ordineItem={
        id_prenotazione : idOrdine,
        id_viaggio: item.id_viaggio,
        quantita: item.quantita,
        prezzo_unitario: item.PU,
      };

      this.ordineItemService.createOrdineItem(ordineItem).subscribe({
        next:()=>{
          this.aggiornaQuantitaMagazzino(item.id_viaggio,item.quantita);
          itemProcessati++;
          if (itemProcessati===this.carrelloItems.length){
            this.ordineCompletatoConSuccesso();
          }
        },
        error: (err) => {
          console.error('Errore aggiunta item:', err);
          this.errore = 'Errore aggiunta ordine';
        }
        
      });
    }
  }
  aggiornaQuantitaMagazzino(id_viaggio: number, quantitaAcquistata: number): void {
    this.viaggioService.getViaggioById(id_viaggio).subscribe({
      next: (viaggio) => {
        const postiDisponibili = viaggio.posti ?? (viaggio as unknown as { posti_disponibili?: number }).posti_disponibili ?? 0;
        const nuovaQuantita = Math.max(postiDisponibili - quantitaAcquistata, 0);

        this.viaggioService.updateQuantita(id_viaggio, nuovaQuantita).subscribe({
          error: (err) => console.error('Errore aggiornamento posti', err)
        });
      },
      error: (err) => console.error('Errore lettura viaggio', err)
    });
  }

 
  ordineCompletatoConSuccesso(): void {
   
    this.carrelloService.svuotaCarrello();
    this.messaggio = 'Ordine creato con successo! Reindirizzamento in corso...';
    this.errore = '';
    
    // Reindirizza allo storico ordini dopo 2 secondi 
    // Per implementare l'elaborazione ordine per utente
    setTimeout(() => {
      this.router.navigate(['/order-history']);
    }, 2000);
  }

  tornaAlCarrello(): void {
    this.router.navigate(['/carrello']);
  }

}
