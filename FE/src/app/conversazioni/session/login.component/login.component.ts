import { Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UtenteService } from '../../../servizi/utente.service';
import { SessionService } from '../../../servizi/session.service';
import { Utente } from '../../../modelli/utente.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})



export class LoginComponent {
  username: string ='';
  password: string='';
  errore: string='';

  constructor(
    private utenteService: UtenteService,
    private sessionService : SessionService,
    private router: Router
  ){}

  login(): void{
    this.utenteService.login(this.username,this.password).subscribe({
      next: (response: {messaggio: string; utente: Utente}) =>{
        if (response.utente.stato==='bloccato'){
          this.errore='Il tuo profilo è stato bloccato. Contatta l\' assistenza';
          return;
        }

        this.sessionService.setLoggedUser(response.utente); //salva utente nell sessione
        this.router.navigate(['/home']); //ritorna alla home 
      },

      error: (err)=>{
        this.errore=err.error?.errore|| 'Username o password errati';
      }
    });
  }

  clearForm():void{
    this.username='';
    this.password='';
    this.errore='';
  }

}
