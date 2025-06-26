import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NoticiaThumb {
  idNoticia: number;
  titulo: string;
  subtitulo: string;
  autor: string;
  dataPublicacao: string;
  liga?: string|null;
  temImagem: boolean;
}

export interface NoticiaDetalhe {
  idNoticia: number;
  titulo: string;
  subtitulo: string;
  conteudo: string;
  autor: string;
  dataPublicacao: string;
  liga?: string|null;
  linkInstagram?: string|null;
  temImagem: boolean;       // ← novo
}

@Injectable({ providedIn: 'root' })
export class NoticiasService {

  private api = '/api/noticias';

  constructor(private http: HttpClient) {}

  listar(ligaId?: number, limite = 20): Observable<NoticiaThumb[]> {
    const url = ligaId ? `${this.api}?ligaId=${ligaId}&limite=${limite}`
                       : `${this.api}?limite=${limite}`;
    return this.http.get<NoticiaThumb[]>(url);
  }

  obter(id: number): Observable<NoticiaDetalhe> {
    return this.http.get<NoticiaDetalhe>(`${this.api}/${id}`);
  }

  imagemUrl(id: number){ return `${this.api}/${id}/imagem`; }
}
