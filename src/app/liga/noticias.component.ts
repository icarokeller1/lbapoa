import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelecionarLigaService } from '../services/selecionar-liga.service';

@Component({
  standalone: true,
  imports: [CommonModule],        // ⬅️ resolve *ngIf
  template: `
    <h1 *ngIf="liga(); else semLiga">
      Próximos jogos – {{ liga()?.nome }}
    </h1>
    <ng-template #semLiga>
      <p class="text-muted">Selecione uma liga primeiro.</p>
    </ng-template>
  `
})
export class NoticiasComponent {
  liga = inject(SelecionarLigaService).liga$;
}