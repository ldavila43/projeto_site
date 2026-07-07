export interface RequestGetTiposKit {
    idTipoKit?: string,
    materialColeta?: string,
    tipoAmostra?: string,
    status?: string,
    limit?: string,
    page?: string
}

export interface TiposKitAmostra {
    idTipoKit: number,
    materialColeta: string,
    tipoAmostra: string,
    status: string
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ResponseGetTiposKit {
    tiposKit: TiposKitAmostra[],
    metadados: Metadados
}