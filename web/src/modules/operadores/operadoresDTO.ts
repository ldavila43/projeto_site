export interface FiltroBuscaOperadores {
    nomeOperador?: string,
    documentoOperador?: string,
    status?: string,
    idPerfil?: string,
    limit?: string,
    offset?: string,
    page?: string
}

export interface Operador {
    idOperador: string,
    nomeOperador: string,
    documentoOperador: string,
    statusOperador: string,
    listaPerfis: string[]
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface OperadoresResponse {
    dados: Operador[]
    metadados: Metadados
}