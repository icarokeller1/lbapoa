// ===================== ligas-list.component.ts =====================
import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LigasService } from '../services/ligas.service';
import { SelecionarLigaService } from '../services/selecionar-liga.service';

/**
 * LigasListComponent  ‑  lista e filtra as ligas disponíveis.
 *
 *   • Filtros de status são controlados por um _signal_ (\`filtro$\`).
 *   • Layout responsivo via CSS Grid.
 *   • Animações sutis no hover dos cards.
 */
@Component({
  standalone: true,
  selector: 'app-ligas-list',
  imports: [CommonModule],
  templateUrl: './ligas-list.component.html',
  styleUrls: ['./ligas-list.component.scss']
})
export class LigasListComponent {
  private ligasSrv = inject(LigasService);
  private sel      = inject(SelecionarLigaService);
  private router   = inject(Router);

  /** lista completa trazida do backend */
  private _todas = signal<any[]>([]);

  /** filtro de status – null = todas */
  filtro$ = signal<'NAO_INICIADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | null>(null);

  /** ligas já filtradas (memoizado via \`computed\`) */
  ligas = computed(() => {
    const status = this.filtro$();
    return status ? this._todas().filter(l => l.status === status) : this._todas();
  });

  /** flag de carregamento */
  carregando = signal(false);

  constructor() {
    // faz a busca logo que o componente é criado
    this.buscar();

    // toda vez que o filtro mudar, rola suavemente pro topo
    effect(() => {
      this.ligas();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /** busca as ligas no serviço */
  buscar() {
    this.carregando.set(true);
    this.ligasSrv.listar().subscribe({
      next: dados => {
        this._todas.set(dados);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  /** altera o filtro de status */
  setFiltro(status: 'NAO_INICIADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | null) {
    this.filtro$.set(status);
  }

  /** clique no card */
  detalhes(id: number) {
    const liga = this._todas().find(l => l.idLiga === id);
    if (!liga) return;
    this.sel.set(liga);
    this.router.navigate(['/liga', id]);
  }
}