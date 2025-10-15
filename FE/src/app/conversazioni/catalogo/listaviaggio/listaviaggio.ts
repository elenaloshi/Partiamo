import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ViaggioService } from '../../../servizi/viaggio.service';
import { Viaggio } from '../../../modelli/viaggio.model';
import { SessionService } from '../../../servizi/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listaviaggio',
  standalone:true,
  imports: [CommonModule,RouterModule],
  templateUrl: './listaviaggio.html',
  styleUrl: './listaviaggio.css'
})


export class Listaviaggio implements OnInit, OnDestroy {

  viaggi: Viaggio[]=[];
  titoloPagina: string = 'Tutti i viaggi disponibili';
  isAdmin = false;
  private sessionSub?: Subscription;

  constructor(
    private viaggioService: ViaggioService,
    private route:ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ){}

  ngOnInit(): void {
      this.sessionSub = this.sessionService.utenteLoggato$.subscribe(utente => {
        this.isAdmin = utente?.ruolo === 'amministratore';
      });

      this.route.queryParams.subscribe(params=>{
        //aggiorno il titolo della pagina in base ai parametri 
        if (params['search']){
          this.titoloPagina=`Ricerca:"${params['search']}"`;
        }else if (params['categoria']){
          this.titoloPagina= `Categoria ${params['categoria']}`
        }else {
          this.titoloPagina='Tutti i viaggi';
        }

        //Chiamo i BE con i parametri
        this.viaggioService.getViaggio(params).subscribe({
          next:(viaggi)=>{
            console.log(viaggi);
            this.viaggi=viaggi.filter(viaggio=>viaggio.stato!=='bloccato');
          },
          error:(err)=>{
            console.error('Errore: ',err);
            this.viaggi=[];
          }
        })



      }
      )
  }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
  }

  modificaViaggio(viaggio: Viaggio, event: Event): void {
    event.stopPropagation();
    if (!viaggio.id_viaggio) {
      return;
    }
    this.router.navigate(['/admin/viaggi', viaggio.id_viaggio, 'edit']);
  }


}
