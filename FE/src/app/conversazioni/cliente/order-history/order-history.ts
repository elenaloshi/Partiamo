import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrenotazioneService } from '../../../servizi/prenotazine.service';
import { OrdineItemService } from '../../../servizi/ordine_item.service';
import { ViaggioService } from '../../../servizi/viaggio.service';
import { SessionService } from '../../../servizi/session.service';
import { Prenotazione } from '../../../modelli/prenotazione.model'; 
import { PrenotazioneItem } from '../../../modelli/prenotazione_item.model';
import { Viaggio } from '../../../modelli/viaggio.model'; 
import { Utente } from '../../../modelli/utente.model';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

interface ItemCompleto {
  ordineItem: PrenotazioneItem;
  viaggio: Viaggio;
}

interface OrdineCompleto {
  prenotazione : Prenotazione;
  items: ItemCompleto[];
}


@Component({
  selector: 'app-order-history',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistory implements OnInit{
  ordiniCompleti:OrdineCompleto[]=[];
  utenteLoggato: Utente | null= null;
  errore: string ='';

  constructor(
    private prenotazioneService: PrenotazioneService,
    private ordineItemService: OrdineItemService,
    private viaggioService: ViaggioService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
      this.utenteLoggato=this.sessionService.getLoggedUser();
      this.caricaOrdini();
  }

  private caricaOrdini():void{

    if (!this.utenteLoggato) {
      this.errore = 'Devi effettuare il login prima di completare l’ordine';
      return;
    }


    const idUtente = this.utenteLoggato.id_utente;
    if (idUtente == null) {
      this.errore = 'Utente non valido';
      return;
    }


    this.prenotazioneService.getPrenotazioneByUtente(idUtente).subscribe({
      next:(prenotazione)=>{
        // Ordina per id_ordine DECRESCENTE (più recenti prima)
        const ordiniOrdinati=prenotazione.sort((a,b)=> b.id_prenotazione - a.id_prenotazione);
        // Per ogni ordine, carica gli items con i dettagli prodotto
        ordiniOrdinati.forEach(prenotazione=>{
          this.ordineItemService.getItemsByOrdine(prenotazione.id_prenotazione!).subscribe({
            next:(items)=>{
              const itemsCompleti: ItemCompleto[]=[];
              let itemsCaricati=0;
              
              items.forEach(item=> {
                this.viaggioService.getViaggioById(item.id_viaggio).subscribe({
                  next: (viaggio)=>{
                    itemsCompleti.push({
                      ordineItem:item,
                      viaggio : viaggio
                    });

                    itemsCaricati++;
                    if (itemsCaricati===items.length){
                      this.ordiniCompleti.push({
                        prenotazione:prenotazione,
                        items:itemsCompleti
                      });
                    }
                  },
                  error:(err) => {
                    console.error('errore caricamento viaggio:',err);
                  }
                  
                });
              });

            },
            error : (err)=>{
              console.error('Errore caricamenro items ',err);
            }
          });
        });

      },
      error: (err) => {
        console.error('Errore caricamento prenotazione:', err);
        this.errore = 'Errore nel caricamento degli prenotazione';
      }

    });
  }

  }
