import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Partida } from '../services/ligas.service';

@Component({
  standalone: true,
  selector: 'app-partidas-dia',
  imports: [CommonModule],
  template: `
  <div *ngIf="partidas?.length===0"
       class="alert alert-info text-center">
    Nenhuma partida para esta data.
  </div>

  <div *ngFor="let p of partidas"
       class="card mb-3 border-0 shadow-sm">

    <div class="card-body px-4">

      <div class="d-flex justify-content-between text-muted small mb-2">
        <span class="fw-semibold">{{ p.dataHora | date:'HH:mm' }}</span>
        <span>{{ p.local }}</span>
      </div>

      <!-- Mandante -->
      <div class="d-flex align-items-center mb-1">
        <img class="me-2 rounded"
             [src]="'/api/times/' + p.idTimeCasa + '/logo'"
             width="32" height="32"
             onerror="this.style.display='none'">
        <strong class="me-auto">{{ p.nomeTimeCasa }}</strong>
        <span class="fw-bold fs-5">{{ p.placarCasa }}</span>
      </div>

      <!-- Visitante -->
      <div class="d-flex align-items-center">
        <img class="me-2 rounded"
             [src]="'/api/times/' + p.idTimeFora + '/logo'"
             width="32" height="32"
             onerror="this.style.display='none'">
        <span class="me-auto">{{ p.nomeTimeFora }}</span>
        <span class="fs-5">{{ p.placarFora }}</span>
      </div>
    </div>
  </div>
  `
})
export class PartidasDiaComponent{
  @Input() partidas: Partida[] = [];
}
