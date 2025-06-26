import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NoticiasService, NoticiaDetalhe } from '../services/noticias.service';

@Component({
  standalone: true,
  selector  : 'app-noticia-detail',
  imports   : [CommonModule, RouterLink],
  styles: [`
    :host{display:block;padding:0 1rem}
    .news-img{
      max-height:280px;         /* menor */
      max-width:600px;          /* centralizada */
      width:100%;
      object-fit:cover;
      border-radius:.75rem;
      margin:1.25rem auto;      /* espaço ao redor */
      display:block;
    }
    .card{
      border-radius:.75rem;
      box-shadow:0 4px 12px #0002;
    }
    .card-body{padding:2rem 1.5rem}
    @media (min-width:768px){.card-body{padding:3rem 4rem}}
  `],
  template:`
  <a routerLink="/noticias" class="d-inline-block mb-3 text-decoration-none">
    <i class="bi bi-arrow-left"></i> Voltar
  </a>

  <!-- garante que só renderiza após carregar -->
  <ng-container *ngIf="noticia as n; else carregando">

    <div class="card border-0 mx-auto" style="max-width:900px">

      <!-- TÍTULO -->
      <div class="card-body pt-4 pb-0 text-center">
        <h1 class="fw-bold mb-2">{{ n.titulo }}</h1>
        <h4 class="text-muted" *ngIf="n.subtitulo">{{ n.subtitulo }}</h4>
      </div>

      <!-- IMAGEM opcional -->
      <img *ngIf="n.temImagem" class="news-img" [src]="img(n.idNoticia)" />

      <!-- META + CONTEÚDO -->
      <div class="card-body pt-0">

        <p class="small text-secondary mb-4 text-center">
          {{ n.autor }} · {{ n.dataPublicacao | date:'dd/MM/yyyy' }}
          <span *ngIf="n.liga"> · {{ n.liga }}</span>
        </p>

        <div [innerHTML]="n.conteudo" class="news-content"></div>

        <a *ngIf="n.linkInstagram"
           [href]="n.linkInstagram" target="_blank"
           class="btn btn-outline-danger mt-4">
          <i class="bi bi-instagram"></i> Ver no Instagram
        </a>
      </div>
    </div>
  </ng-container>

  <ng-template #carregando>
    <p class="text-center text-muted mt-5">Carregando…</p>
  </ng-template>
  `
})
export class NoticiasDetailComponent {

  private srv   = inject(NoticiasService);
  private route = inject(ActivatedRoute);

  noticia!: NoticiaDetalhe;

  constructor(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.srv.obter(id).subscribe(res => this.noticia = res);
  }

  img(id:number){ return this.srv.imagemUrl(id); }
}
