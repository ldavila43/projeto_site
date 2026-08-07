import { StatusGenerico } from '@/src/shared/utils/StatusEnum';

export interface RequestGetTiposKit {
    idTipoKit?: string,
    materialColeta?: string,
    tipoAmostra?: string,
    status?: StatusGenerico | '',
    limit?: string,
    page?: string
}

export interface TiposKitAmostra {
    idTipoKit: number,
    materialColeta: string,
    tipoAmostra: string,
    status: StatusGenerico
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ResponseGetTiposKit {
    tiposKit: TiposKitAmostra[],
    metadados: Metadados
}
