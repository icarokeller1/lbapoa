import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatISO, parseISO } from 'date-fns';
import { SelecionarLigaService } from '../services/selecionar-liga.service';
import { LigasService, Partida } from '../services/ligas.service';
import { ClassificacaoComponent } from './classificacao.component';
import { PartidasDiaComponent } from './partidas-dia.component';

@Component({
  standalone: true,
  imports: [CommonModule, ClassificacaoComponent, PartidasDiaComponent],
  template: `
  <!-- ————————————————————  TÍTULO GERAL  ———————————————————— -->
  <h2 class="text-center text-2xl fw-semibold mt-2 mb-4">Partidas</h2>

  <!-- ————————  GRID 50/50 (empilha no mobile)  ———————— -->
  <div class="row row-cols-1 row-cols-md-2 g-4 justify-content-center">

    <!-- ▸ CLASSIFICAÇÃO ------------------------------------------------ -->
    <div class="col-md-5">
      <h3 class="fw-medium text-muted mb-2">Classificação</h3>
      <app-classificacao [ligaId]="liga()?.idLiga"></app-classificacao>
    </div>

    <!-- ▸ PARTIDAS DO DIA --------------------------------------------- -->
    <div class="col-md-5 px-md-4">

      <!-- seletor de data -->
      <div class="d-flex justify-content-end align-items-center mb-3">
        <button class="btn p-0 me-2"
                (click)="navegar(-1)"
                [disabled]="idx===0"
                aria-label="Dia anterior">
          <i class="bi bi-chevron-left fs-4"></i>
        </button>

        <span class="fw-bold fs-5">{{ dataSelecionada | date:'dd/MM/yyyy' }}</span>

        <button class="btn p-0 ms-2"
                (click)="navegar(1)"
                [disabled]="idx===datas.length-1"
                aria-label="Próximo dia">
          <i class="bi bi-chevron-right fs-4"></i>
        </button>
      </div>

      <app-partidas-dia [partidas]="partidasDia"></app-partidas-dia>
    </div>
  </div>
  `
})
export class JogosComponent implements OnInit {
  private sel = inject(SelecionarLigaService);
  private srv = inject(LigasService);

  liga = this.sel.liga$;
  partidasLiga: Partida[] = [];
  datas: string[] = [];
  idx = 0;

  get dataSelecionada() { return parseISO(this.datas[this.idx]); }

  get partidasDia() {
    const iso = this.datas[this.idx];
    return this.partidasLiga.filter(p => p.dataHora.startsWith(iso));
  }

  ngOnInit() {
    const id = this.liga()?.idLiga;
    if (!id) return;

    this.srv.obterPartidasLigaFull(id).subscribe(ps => {
      this.partidasLiga = ps;

      this.datas = Array.from(
        new Set(ps.map(p => p.dataHora.substring(0, 10)))
      ).sort();

      const hojeISO = formatISO(new Date(), { representation: 'date' });
      const posHoje = this.datas.indexOf(hojeISO);
      this.idx = posHoje >= 0 ? posHoje : 0;
    });
  }

  navegar(delta: number) {
    this.idx = Math.min(
      Math.max(this.idx + delta, 0),
      this.datas.length - 1
    );
  }
}
