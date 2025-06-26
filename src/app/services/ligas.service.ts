// src/app/services/ligas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Liga } from '../models/liga.model';

/* ---- novos tipos auxiliares --------------------------------------- */
export interface Partida {
  idPartida: number;
  dataHora: string;          // ISO
  local: string;

  idTimeCasa: number;
  nomeTimeCasa: string;
  placarCasa: number;

  idTimeFora: number;
  nomeTimeFora: string;
  placarFora: number;
}

@Injectable({ providedIn: 'root' })
export class LigasService {
  private readonly api = '/api/ligas';

  constructor(private http: HttpClient) {}

  listar(status?: string): Observable<Liga[]> {
    const url = status ? `${this.api}?status=${status}` : this.api;
    return this.http.get<Liga[]>(url);
  }

  obter(id: number): Observable<Liga> {
    return this.http.get<Liga>(`${this.api}/${id}`);
  }

  /* ← NOVO  : todas as partidas da liga --------------------------------- */
  obterPartidasLigaFull(ligaId: number): Observable<Partida[]> {
    return this.http.get<Partida[]>(`/api/partidas/by-liga-full/${ligaId}`);
  }
}
