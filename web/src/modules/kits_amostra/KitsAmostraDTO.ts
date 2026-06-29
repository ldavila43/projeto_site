export interface KitAmostra {
    idKit: number,
    codApoio: string,
    codBgk: string,
    codLote: string,
    tipoKit: string,
    status: string,
    dataValidade: Date,
    dataAtivacao: Date,
    responsavel: string
}

export interface RequestGetKits {
    codBgk?: string,
    codLote?: string,
    idResponsavel?: string,
    codApoio?: string,
    status?: string,
    tipoKit?: string,
    dataAtivacaoIni?: Date,
    dataAtivacaoFim?: Date,
    dataValidadeIni?: Date,
    dataValidadeFim?: Date,
    limit?: number,
    offset?: number
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ResponseGetKits {
    metadados: Metadados,
    kitsAmostra: KitAmostra[]
}