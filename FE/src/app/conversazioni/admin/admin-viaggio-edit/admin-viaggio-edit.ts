import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ViaggioService } from '../../../servizi/viaggio.service';
import { Viaggio } from '../../../modelli/viaggio.model'; 

type ViaggioAggiornamento = Partial<Viaggio> & { posti_disponibili?: number };

@Component({
  selector: 'app-admin-viaggio-edit',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-viaggio-edit.html',
  styleUrl: './admin-viaggio-edit.css'
})


export class AdminViaggioEdit implements OnInit {
  viaggio: Viaggio = {
    id_viaggio: 0,
    stato_destinazione: '',
    destinazione: '',
    titolo: '',
    partenza: '',
    ritorno: '',
    descrizione: '',
    prezzo: 0,
    categoria: 'avventura',
    id_operatore: 0,
    posti: 0,
    stato: 'attivo'
  };

  categoria = ['avventura', 'citta', 'mare', 'montagna'];
  errore = '';

  constructor(
    private viaggioService:ViaggioService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!Number.isFinite(id)) {
      this.errore = 'Viaggio non valido';
      return;
    }

    this.viaggioService.getViaggioById(id).subscribe({
      next: (viaggio) => {
        const viaggioNormalizzato: Viaggio = {
          ...viaggio,
          partenza: viaggio.partenza?.substring(0, 10) ?? '',
          ritorno: viaggio.ritorno?.substring(0, 10) ?? '',
          posti: viaggio.posti ?? (viaggio as unknown as { posti_disponibili?: number }).posti_disponibili ?? 0
        };
        this.viaggio = viaggioNormalizzato;
        this.errore = '';
      },
      error: (err) => {
        console.error('Errore caricamento viaggio', err);
        this.errore = 'Impossibile caricare il viaggio';
      }
    });
  }

  salvaModifiche(): void {
    const idViaggio = this.viaggio.id_viaggio;
    if (!idViaggio) {
      this.errore = 'Viaggio non valido';
      return;
    }

    const aggiornamento: ViaggioAggiornamento = {
      stato_destinazione: this.viaggio.stato_destinazione,
      destinazione: this.viaggio.destinazione,
      titolo: this.viaggio.titolo,
      partenza: this.viaggio.partenza,
      ritorno: this.viaggio.ritorno,
      descrizione: this.viaggio.descrizione,
      prezzo: this.viaggio.prezzo,
      categoria: this.viaggio.categoria,
      id_operatore: this.viaggio.id_operatore,
      stato: this.viaggio.stato,
      posti_disponibili: this.viaggio.posti
    };

    this.viaggioService.updateViaggio(idViaggio, aggiornamento).subscribe({
      next: () => {
        this.errore = '';
        this.router.navigate(['/admin/viaggi']);
      },
      error: (err) => {
        console.error('Errore salvataggio viaggio', err);
        this.errore = 'Salvataggio non riuscito';
      }
    });
  }

  annulla(): void {
    this.router.navigate(['/admin/viaggi']);
  }

}
