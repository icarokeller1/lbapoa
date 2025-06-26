import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SelecionarLigaService } from '../services/selecionar-liga.service';

// Modelo de dados da liga
interface Liga {
  idLiga: number;
  nome: string;
  descricao?: string;
  dataInicio: string;  // ou Date, conforme seu backend devolva
  dataFim?: string;
  esporte: string;
  status: string;
}

// Resposta simplificada de Partida/by-liga
interface Partida {
  IdPartida: number;
  Descricao: string;  // ex.: "12/07 – TimeA x TimeB"
}

@Component({
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <ng-container *ngIf="ligaSignal() as liga; else semLiga">
      <h1>Próximos jogos – {{ liga.nome }}</h1>

      <div class="player-container">
        <iframe
          [src]="youtubeUrl"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen>
        </iframe>
      </div>

      <h2 class="mt-4">Partidas agendadas</h2>
      <ul *ngIf="partidasSignal().length; else semPartidas">
        <li *ngFor="let p of partidasSignal()">
          {{ p.Descricao }}
        </li>
      </ul>
      <ng-template #semPartidas>
        <li>Nenhuma partida encontrada.</li>
      </ng-template>
    </ng-container>

    <ng-template #semLiga>
      <p class="text-muted">Selecione uma liga primeiro.</p>
    </ng-template>
  `,
  styles: [`
    .player-container {
      width: 70vw;         /* 70% da largura da viewport */
      max-width: 70%;      /* não extrapolar */
      aspect-ratio: 16/9;  /* manter proporção */
      margin: auto;
    }
    .player-container iframe {
      width: 100%;
      height: 100%;
    }
    h2 { font-size: 1.25rem; margin-top: 1rem; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.25rem 0; }
  `]
})
export class AssistirComponent {
  /** Sinal da liga selecionada (pode ser null) */
  readonly ligaSignal: WritableSignal<Liga|null> =
    inject(SelecionarLigaService).liga$;

  /** Sinal local para armazenar próximas partidas */
  readonly partidasSignal = signal<Partida[]>([]);

  /** URL do player do YouTube, já sanitizada */
  readonly youtubeUrl: SafeResourceUrl;

  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    // Substitua pelo Channel ID real do canal YouTube (@lbatvpoa)
    const channelId = 'UCXXXXXXXXXXXXXXXX';
    const embedUrl =
      `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1`;

    this.youtubeUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);

    // Efeito reativo: ao mudar a liga, busca as partidas
    effect(() => {
      const liga = this.ligaSignal();
      if (!liga) {
        this.partidasSignal.set([]);
        return;
      }

      this.http
        .get<Partida[]>(`/api/partidas/by-liga/${liga.idLiga}`)
        .subscribe({
          next: lista => this.partidasSignal.set(lista),
          error: ()     => this.partidasSignal.set([])
        });
    });
  }
}