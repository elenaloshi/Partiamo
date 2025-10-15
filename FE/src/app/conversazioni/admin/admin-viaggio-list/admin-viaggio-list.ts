import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViaggioService } from '../../../servizi/viaggio.service';
import { Viaggio } from '../../../modelli/viaggio.model';

@Component({
  selector: 'app-admin-viaggio-list',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './admin-viaggio-list.html',
  styleUrl: './admin-viaggio-list.css'
})
export class AdminViaggioList implements OnInit {

  viaggi : Viaggio []=[];
  constructor(
    private viaggioService:ViaggioService,
    private router: Router
  ){}

  ngOnInit(): void {
      this.viaggioService.getViaggio().subscribe({
        next: (viaggi) =>this.viaggi= viaggi
      });
  }

  aggiutoViaggio(): void {
    this.router.navigate(['/admin/viaggi/nuovo']);
  }

  modificaViaggio(viaggio: Viaggio): void {
    this.router.navigate(['/admin/viaggi', viaggio.id_viaggio, 'edit']);
  }
}
