import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UtenteService } from '../../../servizi/utente.service';
import { Utente } from '../../../modelli/utente.model';

@Component({
  selector: 'app-signup.component',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})


export class SignupComponent {
  nuovoUtente:Utente={
    id_utente:0,
    nome:'',
    cognome:'',
    username:'',
    password:'',
    data_nascita:'',
    email:'',
    ruolo:'cliente',
    stato:'attivo'
  }

  errore: string='';

  constructor(
    private utenteService: UtenteService,
    private router:Router
  ){}

  signup(): void {
    this.utenteService.createUtente(this.nuovoUtente).subscribe({
      next: () =>{
        this.router.navigate(['/login']);
      },
      error: (err)=>{
        this.errore=err.error?.errore || 'Errore durante la registrazione';
      }
    });
  }


    clearForm(): void{
      this.nuovoUtente={
        id_utente:0,
        nome:'',
        cognome:'',
        username:'',
        password:'',
        data_nascita:'',
        email:'',
        ruolo:'cliente',
        stato:'attivo'
      };
      this.errore='';
    }
}





