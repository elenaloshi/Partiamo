import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarrelloService, CarrelloItem } from '../../../servizi/carrello.service';

@Component({
  selector: 'app-cart',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit{

  carrelloItems: CarrelloItem[] = [];
  messaggio: string = '';
  totaleCarrello: number = 0;

  constructor(
    private carrelloService: CarrelloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caricaCarrello();
  }

  // Carica carrello e calcola totale
  caricaCarrello(): void {
    this.carrelloItems = this.carrelloService.getItems();
    this.calcolaTotale();
  }

  // Calcola totale semplice
  calcolaTotale(): void {
    this.totaleCarrello = 0;
    for (let item of this.carrelloItems) {
      this.totaleCarrello += item.PU * item.quantita;
    }
  }

  // Rimuovi prodotto
  rimuoviProdotto(item: any): void {
    this.carrelloService.rimuoviViaggio(item.id_viaggio);
    this.caricaCarrello();
    this.messaggio = 'Prodotto rimosso!';
  }

  // Svuota carrello
  svuotaCarrello(): void {
    this.carrelloService.svuotaCarrello();
    this.caricaCarrello();
    this.messaggio = 'Carrello svuotato!';
  }

  // Vai al checkout
  procediAlCheckout(): void {
    if (this.carrelloItems.length === 0) {
      this.messaggio = 'Il carrello è vuoto';
      return;
    }
    this.router.navigate(['/checkout']);
  }

  // Continua shopping
  continuaShopping(): void {
    this.router.navigate(['/viaggi']);
  }
}
