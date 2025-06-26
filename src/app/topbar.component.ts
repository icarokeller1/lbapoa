// src/app/topbar.component.ts
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { SelecionarLigaService } from './services/selecionar-liga.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  styles: [`
    :host{
      display:block;
      min-height:100vh;
      position:relative;
    }

    :host::before{
      content:'';
      position:fixed;
      inset:0;
      background:url('src/assets/img/background.jpg') center/cover no-repeat;
      opacity: .35;
      filter: blur(2px);
      z-index:-1;
    }

    .page{
      position:relative;
      z-index:1;
      padding-bottom:4rem;
    }

    .page-inner{
      background:rgba(255,255,255,.88);
      backdrop-filter:blur(4px);
      border-radius:.75rem;
      box-shadow:0 4px 12px #0002;
      padding:2rem 1rem;
      margin-inline:auto;
      max-width:1400px;
    }
  `],
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIf, RouterOutlet],
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" routerLink="/">🏀 LBA Champs</a>

      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#nav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav me-auto">          

          <ng-container *ngIf="hasLiga()">
            <li class="nav-item"><a class="nav-link" [routerLink]="['/liga', liga()?.idLiga]"
                 routerLinkActive="active">Liga</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/jogos"
                 routerLinkActive="active">Jogos</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/assistir"
                 routerLinkActive="active">Assistir</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/noticias"
                 routerLinkActive="active">Notícias</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/estatisticas"
                 routerLinkActive="active">Estatísticas</a></li>
          </ng-container>

          <li class="nav-item"><a class="nav-link" routerLink="/hall-of-fame"
               routerLinkActive="active">Hall of Fame</a></li>
        </ul>

        <span *ngIf="liga()?.nome" class="navbar-text text-warning">
          {{ liga()?.nome }}
        </span>
      </div>
    </div>
  </nav>

  <router-outlet></router-outlet>
  `
})
export class TopbarComponent {
  private sel = inject(SelecionarLigaService);
  liga = this.sel.liga$;

  hasLiga = computed(() => this.liga() !== null);
}
