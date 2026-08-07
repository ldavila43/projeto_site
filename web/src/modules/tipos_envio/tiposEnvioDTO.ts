export interface TipoEnvio {
    idTipoEnvio: number;
    descricao: string;
}

export interface RequestGetTiposEnvio {
    descricao?: string;
    page?: string;
    limit?: string;
}

export interface ResponseGetTiposEnvio {
    dados: TipoEnvio[];
    metadados: {
        totalRegistros: number;
        totalPaginas: number;
    };
}

export interface RequestPostTipoEnvio {
    descricao: string;
}

export interface RequestPatchTipoEnvio {
    descricao: string;
}

export interface RespostaTipoEnvio {
    message: string;
    idTipoEnvio?: number;
}
