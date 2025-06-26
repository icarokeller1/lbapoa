// src/app/services/selecionar-liga.service.ts
import { Injectable, signal } from '@angular/core';
import { Liga } from '../models/liga.model';

@Injectable({ providedIn: 'root' })
export class SelecionarLigaService {
  /** liga atual (null se nenhuma) */
  liga$ = signal<Liga | null>(null);

  set(liga: Liga) { this.liga$.set(liga); }
  clear()         { this.liga$.set(null); }
}
