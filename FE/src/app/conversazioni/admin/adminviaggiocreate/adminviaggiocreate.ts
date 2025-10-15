import { Component } from '@angular/core';
import { ViaggioService } from '../../../servizi/viaggio.service';
import { Viaggio } from '../../../modelli/viaggio.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminviaggiocreate',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './adminviaggiocreate.html',
  styleUrl: './adminviaggiocreate.css'
})
export class Adminviaggiocreate {
  viaggio:Viaggio={
    id_viaggio:0,
    stato_destinazione: '',
    destinazione: '',
    titolo: '',
    partenza: '',
    ritorno: '',
    descrizione: '',
    prezzo: 0,
    categoria: 'mare',
    id_operatore:0,
    posti : 0,
    stato: 'attivo'
  };

  categorie=['avventura','citta','mare','montagna' ];

  constructor (
    private viaggioSrvice: ViaggioService,
    private router: Router
  ){}

  createViaggio():void{
    this.viaggioSrvice.createViaggio(this.viaggio).subscribe({
      next : ()=> this.router.navigate(['/admin/prodotti'])
    });
  }

  annulla():void{
    this.router.navigate(['/admin/viaggi']);
  }

}
