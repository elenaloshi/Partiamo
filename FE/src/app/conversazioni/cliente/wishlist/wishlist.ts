import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistItemService } from '../../../servizi/wishlist_item.service';
import { WishlistService } from '../../../servizi/wishlist.service';
import { ViaggioService } from '../../../servizi/viaggio.service';
import { CarrelloService } from '../../../servizi/carrello.service';
import { SessionService } from '../../../servizi/session.service';
import { Viaggio } from '../../../modelli/viaggio.model';
import { Utente } from '../../../modelli/utente.model';

@Component({
  selector: 'app-wishlist',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {
  viaggi:Viaggio[]=[]; //lista viaggi in wishlisy
  utenteLoggato: Utente|null=null;
  successo: string ='';
  errore: string='';


  constructor(
    private wishlistService: WishlistService,
    private wishlistItemService: WishlistItemService,
    private viaggioService: ViaggioService,
    private carrelloService: CarrelloService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
      this.utenteLoggato=this.sessionService.getLoggedUser();
      this.caricaWishlist();
  }

  caricaWishlist():void{

    if (!this.utenteLoggato) {
      this.errore = 'Devi effettuare il login prima di completare l’ordine';
      return;
    }


    const idUtente = this.utenteLoggato.id_utente;
    if (idUtente == null) {
      this.errore = 'Utente non valido';
      return;
    }


    this.wishlistService.getWishlistByUtente(idUtente).subscribe({
      next: (wishlist)=>{
        if(wishlist) {
          this.wishlistItemService.getItems(idUtente).subscribe({
            next:(items)=>{
              this.viaggi=[]; //svuota array precedente
              items.forEach(item=>{
                this.viaggioService.getViaggioById(item.id_viaggio).subscribe({
                  next: (viaggio)=>{
                    this.viaggi.push(viaggio);
                  },
                  error:(err)=>{
                    console.error('Errore caricamento prodotto',err);
                  }
                });
              });
            },
            error: (err) => {
              console.error('Errore caricamento items wishlist:', err);
              this.errore = 'Errore nel caricamento della wishlist';
            }
          });
        }
      },
      error: (err) => {
        console.error('Errore caricamento wishlist:', err);
        this.errore = 'Errore nel caricamento della wishlist';
      }
    });
  }

  aggiungiAlCarrello(viaggio:any):void{
    const carrelloItem={
      id_viaggio: viaggio.id_viaggio,
      destinazione: viaggio.destinazione,
      PU: viaggio.prezzo,
      quantita:1,
      descrizione: viaggio.descrizione,
      immagine:`/assets/images/${viaggio.id_viaggio}.png`
    };
    this.carrelloService.aggiungiViaggio(carrelloItem);
    this.successo='Prodotto aggiunto al carrello';
    this.errore='';
  }

  rimuoviDallaWishlist(viaggi: Viaggio): void {

    if (!this.utenteLoggato) {
      this.errore = 'Devi effettuare il login prima di completare l’ordine';
      return;
    }


    const idUtente = this.utenteLoggato.id_utente;
    if (idUtente == null) {
      this.errore = 'Utente non valido';
      return;
    }
    this.wishlistItemService.removeItem(idUtente, viaggi.id_viaggio).subscribe({
      next: () => {
        this.successo = 'Prodotto rimosso dalla wishlist!';
        this.errore = '';
        // Ricarica la wishlist
        this.caricaWishlist();
      },
      error: (err) => {
        console.error('Errore rimozione wishlist:', err);
        this.errore = 'Errore nella rimozione dalla wishlist';
      }
    });
  }





}
