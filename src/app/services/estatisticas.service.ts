import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ---------- tipos auxiliares -------------------------------------- */
export interface StatsJogador {
  idJogador: number;
  jogador: string;
  time: string;

  gp:  number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  pf:  number;

  avgPts: number;
  avgReb: number;
  avgAst: number;
  eff:    number;
  dd:     number;
  td:     number;
}

export interface BoxScore {
  idPartida:  number;
  data:       string;   // ISO
  adversario: string;

  pontos:       number;
  rebotes:      number;
  assistencias: number;
  roubosBola:   number;
  tocos:        number;
  faltas:       number;
}

@Injectable({ providedIn: 'root' })
export class EstatisticasService {

  private api = '/api/estatisticaspartidas';

  constructor(private http: HttpClient) {}

  /** tabela agregada por liga (1 linha por jogador) */
  getSumByLiga(ligaId: number): Observable<StatsJogador[]> {
    return this.http.get<StatsJogador[]>(
      `${this.api}/by-liga-sum/${ligaId}`);
  }

  /** histórico jogo-a-jogo de um atleta */
  getHistByJogador(jogadorId: number): Observable<BoxScore[]> {
    return this.http.get<BoxScore[]>(
      `${this.api}/by-jogador-hist/${jogadorId}`);
  }
}
