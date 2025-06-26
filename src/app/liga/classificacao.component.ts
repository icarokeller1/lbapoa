import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LigasService, Partida } from '../services/ligas.service';

interface Linha {
  id: number;
  nome: string;
  vit: number;
  der: number;
  saldo: number;
  pct: number;
}

@Component({
  standalone: true,
  selector: 'app-classificacao',
  imports: [CommonModule],
  styles: [`
    .row-hover:hover{ background:#f3f4f6 !important }
  `],
  template: `
  <table class="table table-sm table-borderless table-striped-columns w-100">
    <thead class="table-light text-secondary small text-center">
      <tr>
        <th style="width:2.5rem;">#</th>
        <th class="text-start">Time</th>
        <th class="text-end">Vitórias</th>
        <th class="text-end">Derrotas</th>
        <th class="text-end">Saldo</th>
        <th class="text-end">%</th>
      </tr>
    </thead>

    <tbody>
      <tr *ngFor="let c of tabela; index as i"
          class="align-middle row-hover"
          [ngClass]="{ 'bg-emerald-50 text-emerald-700': i===0 }">

        <td class="text-center">
          <span class="px-2 py-0 small rounded-pill bg-gray-200">{{ i+1 }}</span>
        </td>
        <td class="text-start">{{ c.nome }}</td>
        <td class="text-end">{{ c.vit }}</td>
        <td class="text-end">{{ c.der }}</td>
        <td class="text-end">{{ c.saldo }}</td>
        <td class="text-end">{{ (c.pct*100) | number:'1.0-0' }}</td>
      </tr>
    </tbody>
  </table>
  `
})
export class ClassificacaoComponent implements OnChanges {
  @Input() ligaId?: number;
  tabela: Linha[] = [];
  private srv = inject(LigasService);

  ngOnChanges() {
    if (!this.ligaId) return;
    this.srv.obterPartidasLigaFull(this.ligaId)
      .subscribe(ps => this.calcular(ps));
  }

  private calcular(partidas: Partida[]) {
    const map = new Map<number, Linha>();

    const add = (id:number,nome:string,vit:number,der:number,saldo:number)=>{
      const l = map.get(id) ?? {id,nome,vit:0,der:0,saldo:0,pct:0};
      l.vit+=vit; l.der+=der; l.saldo+=saldo;
      l.pct = l.vit / (l.vit + l.der || 1);
      map.set(id,l);
    };

    partidas.filter(p=>p.placarCasa!==null&&p.placarFora!==null)
      .forEach(p=>{
        const casaVenceu = p.placarCasa! > p.placarFora!;
        add(p.idTimeCasa,p.nomeTimeCasa,casaVenceu?1:0,casaVenceu?0:1,
            p.placarCasa!-p.placarFora!);
        add(p.idTimeFora,p.nomeTimeFora,casaVenceu?0:1,casaVenceu?1:0,
            p.placarFora!-p.placarCasa!);
      });

    this.tabela = Array.from(map.values())
      .sort((a,b)=>b.vit-a.vit||b.saldo-a.saldo);
  }
}
