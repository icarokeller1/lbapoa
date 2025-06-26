import { Routes } from '@angular/router';
import { ligaSelecionadaGuard } from './guards/liga-selecionada.guard';

export const routes: Routes = [
  { path: '',
    loadComponent: () =>
      import('./ligas/ligas-list.component')
        .then(m => m.LigasListComponent) },

  { path: 'ligas', redirectTo: '', pathMatch: 'full' },

  { path: 'liga/:id',
    loadComponent: () => import('./ligas/ligas-detail.component').then(m => m.LigaDetailsComponent) },

  { path: 'jogos',        canActivate: [ligaSelecionadaGuard],
    loadComponent: () => import('./liga/jogos.component')
                         .then(m => m.JogosComponent) },
  { path: 'assistir',     canActivate: [ligaSelecionadaGuard],
    loadComponent: () => import('./liga/assistir.component')
                         .then(m => m.AssistirComponent) },
  {
    path:'noticias',      canActivate: [ligaSelecionadaGuard],
    children:[
      { path:'',          canActivate: [ligaSelecionadaGuard],
        loadComponent : () => import('./noticias/noticias-list.component')
            .then(m=>m.NoticiasListComponent) },
      { path:':id',       canActivate: [ligaSelecionadaGuard],
        loadComponent: () => import('./noticias/noticias-detail.component')
            .then(m=>m.NoticiasDetailComponent) }
    ]
  },
  { path: 'estatisticas', canActivate: [ligaSelecionadaGuard],
    loadComponent: () => import('./liga/estatisticas.component')
                         .then(m => m.EstatisticasComponent) },

  { path: 'hall-of-fame',
    loadComponent: () => import('./static/hall-of-fame.component')
                         .then(m => m.HallOfFameComponent) },

  { path: '**', redirectTo: '' }
];
