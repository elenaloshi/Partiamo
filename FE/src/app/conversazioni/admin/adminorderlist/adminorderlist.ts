import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router'

import { PrenotazioneService } from '../../../servizi/prenotazine.service';
import { Prenotazione } from '../../../modelli/prenotazione.model';

@Component({
  selector: 'app-adminorderlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adminorderlist.html',
  styleUrl: './adminorderlist.css'
})

export class AdminOrderListComponent implements OnInit{
  prenotazioni: Prenotazione[] =[];
  idUtente : number | null =null;
  titoloSelez: string ='';

  constructor(
    private PrenotazioneService: PrenotazioneService,
    private router : Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.idUtente= params ['id_utente'] ? +params['id_utente'] : null;


        if(this.idUtente){
          this.titoloSelez=`Ordini dell'utente ${this.idUtente}` ;
          this.caricaOrdiniUtente();
        }else {
          this.titoloSelez='Tutti gli ordini';
          this.caricaTuttiOrdini();
        }
      });
  }

  caricaTuttiOrdini(): void{
    this.PrenotazioneService.getPrenotazione().subscribe({
      next : (prenotazioni) => {
        this.prenotazioni= prenotazioni.sort((a,b) => b.id_prenotazione - a.id_prenotazione);
      }

    });
}

  caricaOrdiniUtente () : void {
    this.PrenotazioneService.getPrenotazioneByUtente(this.idUtente!).subscribe({
      next: (prenotazini) => {
        this.prenotazioni= prenotazini.sort((a,b)=>b.id_prenotazione-a.id_prenotazione);
      }
    });
    }


  tornaATuttePrenotazioni(): void {
    this.router.navigate(['/admin/prenotazioni']);
  }
  

}

