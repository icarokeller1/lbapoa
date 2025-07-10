import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { switchMap } from 'rxjs';

import { LigasService } from '../services/ligas.service';
import { InstagramFeedComponent } from '../instagram-feed.component';
import { ClassificacaoComponent } from '../liga/classificacao.component';

@Component({
  standalone: true,
  selector: 'app-liga-details',
  imports: [CommonModule, HttpClientModule, InstagramFeedComponent, ClassificacaoComponent, RouterModule],
  styles: [`
    .hero-banner {
      background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
      color: #1e293b;
      border: 1px solid #f9fafb;
    }
    .hero-banner h1 {
      text-shadow: 0 1px 2px rgba(0, 0, 0, .15);
    }

    .meta-pill {
      background: #ffffff55;
      backdrop-filter: blur(4px);
      border-radius: 9999px;
      padding: .25rem .85rem;
      font-size: .85rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .instagram-media { max-width: 100% !important; }

    .row-hover:hover { background: #f3f4f6 !important; }
  `],
  template: `
  <div class="container-xl py-4" *ngIf="liga; else carregando">

    <a routerLink="/ligas" class="text-decoration-none small d-inline-flex align-items-center mb-3">
      <i class="bi bi-arrow-left-short fs-5 me-1"></i> Voltar
    </a>
    <section class="hero-banner rounded-4 overflow-hidden d-flex flex-column flex-md-row align-items-center p-4 mb-4 shadow-sm">
      <div class="flex-grow-1 text-center text-md-start">
        <h1 class="display-4 fw-bold mb-2">{{ liga.nome }}</h1>
        <p class="lead mb-3">{{ liga.descricao }}</p>

        <div class="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
          <div class="meta-pill"><i class="bi bi-calendar-event me-1"></i> {{ liga.dataInicio | date:'longDate' }}</div>
          <div class="meta-pill" *ngIf="liga.dataFim"><i class="bi bi-flag me-1"></i> {{ liga.dataFim | date:'longDate' }}</div>
          <div class="meta-pill"><i class="bi bi-lightning me-1"></i> {{ liga.status }}</div>
        </div>
      </div>

      <img *ngIf="liga.capaUrl" [src]="liga.capaUrl" class="rounded-4 shadow-lg ms-md-4 mt-4 mt-md-0" style="max-width:260px;" alt="capa liga">
    </section>

    <div class="row g-4">
      <div class="col-lg-8">

        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white fw-semibold"><i class="bi bi-table me-2"></i>Classificação</div>
          <div class="card-body p-0">
            <app-classificacao [ligaId]="liga.idLiga || liga.id"></app-classificacao>
          </div>
        </div>
        <h3 class="fw-semibold">Últimas Notícias</h3>
        <div class="d-flex flex-column gap-4">
          <ng-container *ngFor="let link of instaLinks">
            <blockquote
              class="instagram-media w-90"
              data-instgrm-captioned
              [attr.data-instgrm-permalink]="link"
              data-instgrm-version="14"
              style="background:#FFF;border:0;border-radius:3px;
                     box-shadow:0 0 1px 0 rgba(0,0,0,.5),0 1px 10px 0 rgba(0,0,0,.15);
                     margin:1px; min-width:326px; width:90%;">
            </blockquote>
          </ng-container>
        </div>

        <script async src="//www.instagram.com/embed.js"></script>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <h5 class="card-title fw-semibold mb-3">Sobre a Liga</h5>
            <p class="card-text mb-0">{{ liga.textoSobre || liga.descricao }}</p>
          </div>
        </div>

        <app-instagram-feed></app-instagram-feed>
      </div>
    </div>
  </div>

  <ng-template #carregando>
    <div class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>
  </ng-template>
  `
})
export class LigaDetailsComponent implements OnInit {
  private route    = inject(ActivatedRoute);
  private ligasSrv = inject(LigasService);
  private http     = inject(HttpClient);

  liga: any;
  instaLinks: string[] = [];

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(p => this.ligasSrv.obter(+p.get('id')!))
    ).subscribe(liga => {
      this.liga = liga;
      this.loadInstagramNoticias();
    });
  }

  private loadInstagramNoticias(): void {
    const params: any = { limite: 100 };
    if (this.liga?.id) params.ligaId = this.liga.id;

    this.http.get<any[]>('/api/noticias/instagram', { params })
      .subscribe(lista => {
        this.instaLinks = lista.map(n => n.linkInstagram.trim());

        setTimeout(() => (window as any).instgrm?.Embeds.process(), 0);
      });
  }
}
