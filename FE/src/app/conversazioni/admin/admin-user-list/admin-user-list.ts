import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UtenteService } from '../../../servizi/utente.service';
import { Utente } from '../../../modelli/utente.model';

@Component({
  selector: 'app-admin-user-list',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './admin-user-list.html',
  styleUrl: './admin-user-list.css'
})
export class AdminUserList implements OnInit{
  utenti: Utente[] = [];
  constructor(
    private utenteService: UtenteService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.utenteService.getUtenti().subscribe({
      next: (utenti) => this.utenti = utenti
    });
  }

  cambiaStato(utente: Utente): void {
    const nuovoStato = utente.stato === 'attivo' ? 'bloccato' : 'attivo';

    const idUtente = utente.id_utente;
    if (idUtente == null) {
      return;
    }

    this.utenteService.updateUtenteStato(idUtente, nuovoStato).subscribe({
      next: () => utente.stato = nuovoStato
    });
  }

  vediOrdini(utente: Utente): void {
    this.router.navigate(['/admin/ordini', utente.id_utente]);
  }

}
