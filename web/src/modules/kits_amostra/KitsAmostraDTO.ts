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
    limit?: string,
    page?: string
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ResponseGetKits {
    metadados: Metadados,
    kitsAmostra: KitAmostra[]
}

export const STATUS_KITS = [
    'INATIVO',
    'ATIVO',
    'INVÁLIDO',
    'DESCARTADO'
] as const;

export type StatusKit = (typeof STATUS_KITS)[number];

export interface RequestPostKitAmostra {
    codBgk: string;
    idTipoKit: number;
    local?: string;
    codigoLote: string;
    codApoio?: string;
    dataValidade: string;
    status: StatusKit;
    idResponsavel?: string;
    dataAtivacao?: string;
}
