import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { Viaggio } from '../../../modelli/viaggio.model'; 
import { ViaggioService } from '../../../servizi/viaggio.service';
import { WishlistItem } from '../../../modelli/wishlist_item.model';
import { WishlistItemService } from '../../../servizi/wishlist_item.service';
import { Wishlist } from '../../../modelli/wishlist.model';
import { WishlistService } from '../../../servizi/wishlist.service';
import { CarrelloService, CarrelloItem } from '../../../servizi/carrello.service';  
import { Utente } from '../../../modelli/utente.model';
import { SessionService } from '../../../servizi/session.service';

@Component({
  selector: 'app-dettaglioviaggio',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './dettaglioviaggio.html',
  styleUrls: ['./dettaglioviaggio.css']
})


export class Dettaglioviaggio implements OnInit{
  viaggio: Viaggio | null =null;
  qtaSelezionata: number =1;

  utenteLoggato: Utente | null =null;
  errore: string='';
  successo: string='';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viaggioService: ViaggioService,
    private wishlistItemService : WishlistItemService,
    private sessionService : SessionService,
    private carrelloService: CarrelloService
  ){}

  ngOnInit(): void {
      //carivca utente
      this.utenteLoggato=this.sessionService.getLoggedUser();

      //prede id del viaggio dalla route
      const idParam=this.route.snapshot.paramMap.get('id');
      const id= Number(idParam);
      if (!Number.isFinite(id)){
        this.errore = 'Viaggio non valido';
        return;
      }
      this.caricaViaggio(+id);
  }


  //Prende i dettaggli del viaggio in questione
  caricaViaggio(id: number): void {
    this.viaggioService.getViaggioById(id).subscribe({
      next: (viaggio) => {
        this.viaggio = viaggio;
      },
      error: (error) => {
        console.error('Errore caricamento Viaggio:', error);
        this.errore = 'Viaggio non trovato';
      }
    });
  }

  //aggiungo il viaggio al carrello
  aggiungiAlCarrello(): void {
    if (!this.viaggio) {
      return;
    }

    const idViaggio = this.viaggio.id_viaggio;
    if (!idViaggio) {
      this.errore = 'Viaggio non valido';
      return;
    }

    const carrelloItem: CarrelloItem = {
      id_viaggio: idViaggio,
      destinazione: this.viaggio.destinazione,
      PU: this.viaggio.prezzo,
      quantita: this.qtaSelezionata,
      descrizione: this.viaggio.descrizione,
      immagine: `/assets/images/${idViaggio}.png`
    };

    this.carrelloService.aggiungiViaggio(carrelloItem);
    this.successo='Prodotto aggiunto al carrello';
    this.errore='';
  }

  //aggiungi alla wishlist
  aggiungiAllaWishlist():void{
    if (!this.viaggio) {
      return;
    }

    const idViaggio = this.viaggio.id_viaggio;
    const idWishlist = this.utenteLoggato?.id_utente;
    if (!idViaggio || !idWishlist) {
      this.errore = 'Utente o viaggio non valido';
      return;
    }

    this.wishlistItemService.getItems(idWishlist).subscribe({
      next : (items) => {
        const itemEsistente = items.find(item => item.id_viaggio === idViaggio);
        if (itemEsistente){
          //se è gia in wishlist non lo aggiunge
          this.errore='Viaggio già presente nella wishlist';
          this.successo='';
        }else {
          //se non è presente lo aggiungo 
          const item ={
            id_wishlist: idWishlist,
            id_viaggio: idViaggio
          };

          this.wishlistItemService.addItem(item).subscribe({
            next: ()=>{
              this.successo='Prodotto aggiunto in wishlist';
              this.errore='';
            },
            error: (error)=>{
              console.error('Errore aggiunta wishlist: ',error);
              this.errore='Errore aggiunta wishlist';
            }
          });
        }
      },
      error: (error)=>{
        console.error("Errore controllo wishlist:",error);
        this.errore='Errore controllo wishlist';
      }
    });
  }

  tornaLista(): void{
    this.router.navigate(['/viaggi']);
  }

  get isCliente (): boolean {
    return this.utenteLoggato?.ruolo==='cliente';
  }


}
