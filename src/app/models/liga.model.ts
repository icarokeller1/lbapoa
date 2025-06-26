export interface Liga {
  idLiga: number;
  nome: string;
  descricao?: string;
  dataInicio: string;   // ISO string
  dataFim?: string;
  esporte: string;
  status: string;
}
