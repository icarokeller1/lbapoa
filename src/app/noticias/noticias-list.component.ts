import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoticiasService, NoticiaThumb } from '../services/noticias.service';
import { SelecionarLigaService } from '../services/selecionar-liga.service';

@Component({
  standalone: true,
  selector: 'app-noticias-list',
  imports: [CommonModule, RouterLink],
  styles: [`
    /* wrapper centralizado */
    .container-news {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    /* grid fluido mas com auto-fill (mantém colunas “virtuais”) */
    .news-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      justify-content: center; /* centraliza o conjunto de colunas */
    }

    .card-link {
      display: block;
      text-decoration: none;
      color: inherit;
    }

    /* card com largura máxima e centrado no “slot” */
    .news-card {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      border-radius: .75rem;
      overflow: hidden;
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .news-card:hover,
    .news-card:focus-visible {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 24px rgba(0,0,0,.12);
    }

    /* texto */
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .meta i { font-size: .75rem; }

    /* ratio 16x9 */
    .ratio-16x9 {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
    }
    .ratio-16x9 img,
    .ratio-16x9 .bg-light {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
    }
    .object-fit-cover { object-fit: cover; }
  `],
  template: `
    <h2 class="text-center text-2xl fw-semibold mt-3 mb-4">
      Notícias {{ liga()?.nome ? '– ' + liga()?.nome : '' }}
    </h2>

    <div class="container-news">
      <ng-container *ngIf="noticias.length; else noNews">
        <div class="news-grid">
          <ng-container *ngFor="let n of noticias">
            <a [routerLink]="['/noticias', n.idNoticia]" class="card-link">
              <div class="card news-card" tabindex="0" aria-label="Abrir notícia">

                <!-- capa -->
                <div *ngIf="n.temImagem; else noImg" class="ratio-16x9">
                  <img [src]="img(n.idNoticia)"
                       class="img-fluid rounded-top object-fit-cover">
                </div>
                <ng-template #noImg>
                  <div class="ratio-16x9 bg-light rounded-top"></div>
                </ng-template>

                <!-- corpo do card -->
                <div class="card-body">
                  <h5 class="card-title fw-semibold line-clamp-2">
                    {{ n.titulo }}
                  </h5>
                  <p class="card-text text-muted small line-clamp-2 mb-3">
                    {{ n.subtitulo }}
                  </p>
                  <p class="meta small text-secondary d-flex align-items-center mb-0">
                    <i class="bi bi-calendar me-1"></i>
                      {{ n.dataPublicacao | date:'dd/MM/yyyy' }}
                    <span class="mx-1">·</span>
                    <i class="bi bi-person me-1"></i> {{ n.autor }}
                    <ng-container *ngIf="n.liga">
                      <span class="mx-1">·</span>
                      <i class="bi bi-trophy me-1"></i> {{ n.liga }}
                    </ng-container>
                  </p>
                </div>

              </div>
            </a>
          </ng-container>
        </div>
      </ng-container>

      <ng-template #noNews>
        <p class="text-center text-muted mt-4">
          Nenhuma notícia encontrada.
        </p>
      </ng-template>
    </div>
  `
})
export class NoticiasListComponent implements OnInit {

  private srv  = inject(NoticiasService);
  private selL = inject(SelecionarLigaService);

  liga = this.selL.liga$;             // sinal da liga
  noticias: NoticiaThumb[] = [];      // array de thumbs

  ngOnInit() {
    const ligaId = this.liga()?.idLiga;
    this.srv.listar(ligaId ?? undefined)
      .subscribe(res => this.noticias = res);
  }

  img(id: number) {
    return this.srv.imagemUrl(id);
  }
}
