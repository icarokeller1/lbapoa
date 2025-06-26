import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoticiasService, NoticiaThumb } from '../services/noticias.service';
import { SelecionarLigaService } from '../services/selecionar-liga.service';

@Component({
  standalone:true,
  selector   :'app-noticias-list',
  imports    :[CommonModule, RouterLink],
  styles:[`
    /* grid & card ------------------------------------------------------ */
    .news-card{
        min-height:320px;          /* altura mínima p/ nivelar “dentes” */
        border-radius:.75rem;
        transition:transform .15s ease, box-shadow .15s ease;
    }
    .news-card:hover,
    .news-card:focus-visible{
        transform:translateY(-2px) scale(1.02);
        box-shadow:0 8px 24px #0002;
    }
    .card-link:focus-visible{outline:none}
    .card-link:focus-visible .news-card{
        box-shadow:0 0 0 3px #0d6efd40;
    }

    /* texto ------------------------------------------------------------ */
    .line-clamp-2{
        display:-webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        overflow:hidden;
    }
    .meta i{font-size:.75rem}     /* ícones menores */

    /* imagem ----------------------------------------------------------- */
    .object-fit-cover{object-fit:cover}
    `],
  template:`
    <h2 class="text-center text-2xl fw-semibold mt-3 mb-4">
        Notícias {{ liga()?.nome ? '– ' + liga()?.nome : '' }}
    </h2>

    <!-- grade fluida ----------------------------------------------------- -->
    <div class="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3">

    <div class="col" *ngFor="let n of noticias">
        <a [routerLink]="['/noticias', n.idNoticia]"
        class="text-decoration-none text-dark card-link">

        <div class="card h-100 border-0 shadow-sm news-card"
            tabindex="0" aria-label="Abrir notícia">

            <!-- capa opcional -->
            <div class="ratio ratio-16x9"
                *ngIf="n.temImagem; else noImg">
            <img [src]="img(n.idNoticia)"
                class="img-fluid rounded-top object-fit-cover">
            </div>
            <ng-template #noImg>
            <div class="ratio ratio-16x9 bg-light rounded-top"></div>
            </ng-template>

            <!-- texto ---------------------------------------------------- -->
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
    </div>
    </div>

    <p *ngIf="!noticias.length" class="text-center text-muted mt-4">
    Nenhuma notícia encontrada.
    </p>

  `
})
export class NoticiasListComponent implements OnInit {

  private srv  = inject(NoticiasService);
  private selL = inject(SelecionarLigaService);

  liga = this.selL.liga$;           // sinal

  noticias: NoticiaThumb[] = [];

  ngOnInit(){
    const id = this.liga()?.idLiga;
    this.srv.listar(id ?? undefined).subscribe(res => this.noticias = res);
  }

  img(id:number){ return this.srv.imagemUrl(id); }
}
