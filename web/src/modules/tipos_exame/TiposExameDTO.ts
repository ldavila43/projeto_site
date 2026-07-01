

export interface TipoExame {
    idTipoExame: number,
    descricao: string,
    status: string,
    idCategoriaExame: number,
    categoriaExame: number
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ResponseGetTiposExame {
    metadados: Metadados,
    tiposExame: TipoExame[]
}

export interface RequestGetTiposExame {
    descricao?: string,
    status?: string,
    categoriaExame?: string,
    limit?: string,
    page?: string
}

export interface RequestPostTipoExame {
    nome: string,
    caminhoImagem?: string,
    caminhoIcone?: string,
    caminhoLogo?: string,
    status?: string,
    idCategoriaExame?: number
}