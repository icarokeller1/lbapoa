import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { EstatisticasService, StatsJogador, BoxScore }
        from '../services/estatisticas.service';
import { SelecionarLigaService } from '../services/selecionar-liga.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector  : 'app-estatisticas',
  imports   : [CommonModule, FormsModule, HttpClientModule],
  styles: [`
    :host{display:block;max-width:1400px;margin:auto;padding:0 1rem}
    th,td{text-align:center;vertical-align:middle}
    .row-hover:hover{background:#f8f9fa!important}
  `],
  template: `
  <h2 class="text-center text-2xl fw-semibold mt-3 mb-4">
    Estatísticas – {{ liga()?.nome ?? '-' }}
  </h2>

  <!-- FILTRO DE NOME -------------------------------------------------- -->
  <div class="row mb-4 justify-content-center">
    <div class="col-auto">
      <input type="text"
             class="form-control"
             placeholder="Filtrar jogador"
             [(ngModel)]="filtroJogador">
    </div>
  </div>

  <!-- TABELA AGREGADA ------------------------------------------------- -->
  <div class="table-responsive" *ngIf="dados.length">
    <table class="table table-sm table-hover table-striped-columns">
      <thead class="table-light text-center small">
        <tr>
          <th class="text-start">Jogador</th>
          <th>Jogos</th><th>Pontos</th><th>Rebotes</th><th>Assistências</th>
          <th>Eficiência</th><th>Duplo-duplos</th><th>Triplo-duplos</th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let j of dadosFiltrados()"
            (click)="selecionar(j)"
            class="row-hover"
            [class.table-primary]="sel?.idJogador===j.idJogador"
            style="cursor:pointer">
          <td class="text-start">{{ j.jogador }}
              <small class="text-muted">({{ j.time }})</small></td>
          <td>{{ j.gp }}</td>
          <td>{{ j.pts }}</td>
          <td>{{ j.reb }}</td>
          <td>{{ j.ast }}</td>
          <td>{{ j.eff }}</td>
          <td>{{ j.dd }}</td>
          <td>{{ j.td }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p class="text-center text-muted"
     *ngIf="liga() && !dados.length">Nenhuma estatística encontrada.</p>

  <!-- HISTÓRICO DO JOGADOR ------------------------------------------- -->
  <div *ngIf="hist.length" class="mt-4">
    <h4>{{ sel?.jogador }} – jogos</h4>

    <table class="table table-sm table-striped">
      <thead class="table-light small">
        <tr>
          <th>Data</th><th>Adversário</th>
          <th>Pontos</th><th>Rebotes</th><th>Assistências</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let r of hist">
          <td>{{ r.data | date:'dd/MM' }}</td>
          <td>{{ r.adversario }}</td>
          <td>{{ r.pontos }}</td>
          <td>{{ r.rebotes }}</td>
          <td>{{ r.assistencias }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class EstatisticasComponent {

  /* serviços --------------------------------------------------------- */
  private srv   = inject(EstatisticasService);
  private selLg = inject(SelecionarLigaService);

  liga = this.selLg.liga$;          // sinal com a liga atual
  dados: StatsJogador[] = [];
  filtroJogador = '';

  sel : StatsJogador|null = null;
  hist: BoxScore[] = [];

  constructor(){
    /* sempre que a liga muda, recarrega a tabela */
    effect(() => {
      const l = this.liga();
      if (l){
        this.carregarTabela(l.idLiga);
      }else{
        this.dados = []; this.sel=null; this.hist=[];
      }
    });
  }

  /* ---------------- helpers ---------------------------------------- */
  carregarTabela(ligaId:number){
    this.sel=null; this.hist=[];
    this.srv.getSumByLiga(ligaId).subscribe(res => this.dados = res);
  }

  dadosFiltrados(){
    const f = this.filtroJogador.toLowerCase();
    return this.dados.filter(d => d.jogador.toLowerCase().includes(f));
  }

  selecionar(j:StatsJogador){
    this.sel = j;
    this.srv.getHistByJogador(j.idJogador)
      .subscribe(res => this.hist = res);
  }
}
