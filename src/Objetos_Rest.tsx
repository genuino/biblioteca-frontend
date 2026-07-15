
export interface Aluno {
  id: number;
  matricula: string;
  nome: string;
}

export interface Autor {
  id: number;
  nome: string;
  foto?: string;
  observacao?: string;
}

export interface Categoria {
  id: number;
  categoria: string;
  caminhoCategoria?: string;
  categoriasTodosPai?: number;
  children?: Categoria[];
}

export interface Livro {
  id: number;
  titulo: string;
  editora: string;
  edicao: string;
  imagem: string | null;
  descricao: string;
  categoria: Categoria | null;
  copia: number;
  autores: Autor[];
  isbn?: string;
  publicacao?: string;
  _publicacaoDisplay?: string;
  localizacao?: string;
}

export interface Configuracao {
    id: number,
    qtasReservas: number,
    qtosDiasReserva: number,
    diariaEmprestimo: number,
    qtosEmprestimo: number,
    jurosAtrasoDiario: number,
    jurosAtrasoMulta: number,
    qtosDiasPenalizacao: number,
    qtasInfracoesPenalizacao: number,
    valorDiariaMulta: number,
    periodoPenalizacao: number,
    cobrarAtraso: boolean
}
