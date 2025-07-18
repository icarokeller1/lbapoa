import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { SelecionarLigaService } from '../services/selecionar-liga.service';
import { Liga } from '../models/liga.model';

/* -------------------------------------------------------------------------- */
/*                                    MODELS                                  */
/* -------------------------------------------------------------------------- */
interface PartidaAgendada {
  idPartida: number;
  descricao: string;
  liga: string;
}

interface PartidaAtualInfo {
  idPartida: number;
  dataHora: string;
  local: string;
  mandante: string;
  visitante: string;
  liga: string;
}

interface Estatistica {
  idEstatistica: number;
  jogador: string;
  numeroCamisa: number;
  time: string;
  pontos: number;
  rebotes: number;
  assistencias: number;
  roubosBola: number;
  tocos: number;
  faltas: number;
}

interface PartidaAtual {
  partida: PartidaAtualInfo | null;
  estatisticas: Estatistica[];
}

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */
@Component({
  selector: 'app-assistir',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <h1>Assistir – {{ ligaSignal()?.nome }}</h1>

    <div class="overlay-container">
      <div class="content-wrapper">
        <div class="player-container">
          <!--  iframe seguro  -->
          <iframe
            [src]="youtubeUrl"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>

        <aside class="stats-sidebar">
          <h2>Estatísticas ao Vivo</h2>
          <ng-container *ngIf="partidaEmAndamentoSignal() as partida; else semAndamento">
            <p class="match-header">
              <strong>{{ partida.mandante }} x {{ partida.visitante }}</strong><br>
              {{ partida.local }} — {{ partida.dataHora | date:'shortTime' }} —
              <em>{{ partida.liga }}</em>
            </p>

            <div *ngFor="let group of groupedEstatisticas()" class="team-group">
              <h3>{{ group.team }}</h3>
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Jogador</th><th>P</th><th>R</th><th>A</th><th>RB</th><th>T</th><th>F</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let e of group.items">
                    <td>{{ e.jogador }} ({{ e.numeroCamisa }})</td>
                    <td>{{ e.pontos }}</td>
                    <td>{{ e.rebotes }}</td>
                    <td>{{ e.assistencias }}</td>
                    <td>{{ e.roubosBola }}</td>
                    <td>{{ e.tocos }}</td>
                    <td>{{ e.faltas }}</td>
                  </tr>
                  <tr class="totals-row">
                    <td>Total</td>
                    <td>{{ group.totals.pontos }}</td>
                    <td>{{ group.totals.rebotes }}</td>
                    <td>{{ group.totals.assistencias }}</td>
                    <td>{{ group.totals.roubosBola }}</td>
                    <td>{{ group.totals.tocos }}</td>
                    <td>{{ group.totals.faltas }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ng-container>
          <ng-template #semAndamento>
            <p class="text-muted">Nenhuma partida em andamento.</p>
          </ng-template>
        </aside>
      </div>

      <div class="upcoming-games" *ngIf="partidasSignal().length; else semPartidas">
        <h2>Próximas Partidas</h2>
        <div class="games-cards">
          <div class="game-card" *ngFor="let p of partidasSignal()">
            <div class="game-desc">{{ p.descricao }}</div>
            <div class="game-league">{{ p.liga }}</div>
          </div>
        </div>
      </div>
      <ng-template #semPartidas>
        <p class="text-muted">Nenhuma partida encontrada.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    /* Layout raiz */
    .overlay-container { position: relative; width: 100%; height: 100%; }

    /* Duas colunas: vídeo e estatísticas */
    .content-wrapper { display: flex; gap: 1rem; margin: 0.5rem; }

    /* PLAYER */
    .player-container { flex: 4; aspect-ratio: 16 / 9; }
    .player-container iframe { width: 100%; height: 100%; border: none; }

    /* BARRA LATERAL */
    .stats-sidebar { flex: 1; background: rgba(0, 0, 0, 0.5); color: #fff; padding: 1rem; overflow-y: auto; max-height: 75vh; border-radius: 0.5rem; }
    .stats-sidebar h2 { margin-top: 0; }
    .stats-sidebar .match-header { font-size: 0.9rem; margin-bottom: 0.5rem; }
    .stats-sidebar .totals-row { font-weight: bold; border-top: 1px solid rgba(255, 255, 255, 0.3); }

    /* PRÓXIMAS PARTIDAS */
    .upcoming-games h2 { margin-bottom: 0.5rem; }
    .games-cards { display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem; }
    .game-card { flex: 0 0 auto; min-width: 8rem; background: rgba(255, 255, 255, 0.1); border-radius: 0.5rem; padding: 0.75rem; text-align: center; transition: transform 0.2s; }
    .game-card:hover { transform: translateY(-4px); background: rgba(255, 255, 255, 0.15); }
    .game-desc { margin: 0.5rem 0; font-size: 0.9rem; }
    .game-league { font-size: 0.8rem; opacity: 0.7; }
  `]
})
export class AssistirComponent {
  /* ------------------------------------------------------------------------ */
  /*                               DEPENDÊNCIAS                               */
  /* ------------------------------------------------------------------------ */
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);

  /* ------------------------------------------------------------------------ */
  /*                                 SIGNALS                                  */
  /* ------------------------------------------------------------------------ */
  readonly ligaSignal = inject(SelecionarLigaService).liga$ as WritableSignal<Liga | null>;
  readonly partidasSignal = signal<PartidaAgendada[]>([]);
  readonly partidaEmAndamentoSignal = signal<PartidaAtualInfo | null>(null);
  readonly estatisticasSignal = signal<Estatistica[]>([]);

  /* ------------------------------------------------------------------------ */
  /*                                YOUTUBE                                  */
  /* ------------------------------------------------------------------------ */
  youtubeUrl!: SafeResourceUrl;

  /** Agrupamento e totais calculados das estatísticas */
  readonly groupedEstatisticas = computed(() => {
    const sorted = [...this.estatisticasSignal()].sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      return b.assistencias - a.assistencias;
    });

    const teams = Array.from(new Set(sorted.map(e => e.time)));

    return teams.map(team => {
      const items = sorted.filter(e => e.time === team);
      const totals = {
        pontos: items.reduce((s, e) => s + e.pontos, 0),
        rebotes: items.reduce((s, e) => s + e.rebotes, 0),
        assistencias: items.reduce((s, e) => s + e.assistencias, 0),
        roubosBola: items.reduce((s, e) => s + e.roubosBola, 0),
        tocos: items.reduce((s, e) => s + e.tocos, 0),
        faltas: items.reduce((s, e) => s + e.faltas, 0)
      };
      return { team, items, totals } as const;
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                                CONSTRUTOR                                */
  /* ------------------------------------------------------------------------ */
  constructor() {
    this.setVideo('prXZ0u2KHeI');           // ID do vídeo inicial
    this.loadProximas();                    // carrega jogos futuros
    this.loadAtual();                       // carrega jogo em andamento (se houver)
    setInterval(() => this.loadAtual(), 60_000); // atualiza a cada minuto
  }

  /* ------------------------------------------------------------------------ */
  /*                                MÉTODOS                                   */
  /* ------------------------------------------------------------------------ */
  /**
   * Define a URL de incorporação segura para o iframe, eliminando erros de
   * segurança (sanitize) e usando o domínio "nocookie".
   */
  private setVideo(videoId: string): void {
    const embed = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&mute=1`;
    this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  }

  /** Obtém a lista de próximas partidas */
  private loadProximas(): void {
    this.http.get<PartidaAgendada[]>('/api/partidas/proximas').subscribe({
      next: lista => this.partidasSignal.set(lista),
      error: () => this.partidasSignal.set([])
    });
  }

  /** Obtém a partida em andamento e estatísticas */
  private loadAtual(): void {
    this.http.get<PartidaAtual>('/api/partidas/atual').subscribe({
      next: data => {
        if (data.partida) {
          this.partidaEmAndamentoSignal.set(data.partida);
          this.estatisticasSignal.set(data.estatisticas);
        } else {
          this.partidaEmAndamentoSignal.set(null);
          this.estatisticasSignal.set([]);
        }
      },
      error: () => {
        this.partidaEmAndamentoSignal.set(null);
        this.estatisticasSignal.set([]);
      }
    });
  }
}
