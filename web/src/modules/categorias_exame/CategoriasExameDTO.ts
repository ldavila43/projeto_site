
export interface FiltrosGetCategorias {
    idCategoria?: string,
    nome?: string,
    status?: string,
    limit?: string,
    page?: string
}

export interface CategoriaExame {
    idCategoria: string,
    descricao: string,
    texto: string,
    status: string
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ResponseGetCategorias {
    categorias: CategoriaExame[],
    metadados: Metadados
}