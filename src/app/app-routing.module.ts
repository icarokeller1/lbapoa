import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LigasListComponent }   from './ligas/ligas-list.component';
import { LigaDetailsComponent } from './ligas/ligas-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'ligas', pathMatch: 'full' },
  { path: 'ligas',      component: LigasListComponent },
  { path: 'ligas/:id',  component: LigaDetailsComponent },
  { path: '**', redirectTo: 'ligas' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
