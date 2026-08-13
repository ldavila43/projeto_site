import { StatusKit } from '@/src/shared/utils/StatusEnum';
export { STATUS_KITS } from '@/src/shared/utils/StatusEnum';

export interface KitAmostra {
    idKit: number,
    codigoBarras: string | null,
    codBgk: string,
    codLote?: string,
    tipoKit: string | null,
    local: string | null,
    status: StatusKit,
    dataValidade: string,
    dataAtivacao?: string,
    responsavel: string | null,
    disponivelParaEnvio: boolean,
    idTipoAmostra?: number,
    nomeTipoAmostra?: string
}

export interface RequestGetKits {
    codBgk?: string,
    codLote?: string,
    idResponsavel?: string,
    codigoBarras?: string,
    status?: StatusKit | '',
    tipoKit?: string,
    dataAtivacaoIni?: string,
    dataAtivacaoFim?: string,
    dataValidadeIni?: string,
    dataValidadeFim?: string,
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

export interface RequestPostKitAmostra {
    codBgk: string;
    idTipoKit: number;
    local?: string;
    codigoLote: string;
    codigoBarras?: string;
    dataValidade: string;
    status: StatusKit;
    idResponsavel?: string;
    dataAtivacao?: string;
}

export type RequestPatchKitAmostra = Partial<RequestPostKitAmostra>;

export interface RespostaAtualizacaoKit {
    message: string;
}

export type ResultadoExclusaoKit =
    | {
        sucesso: true;
        mensagem: string;
    }
    | {
        sucesso: false;
        mensagem: string;
        permiteForcar: boolean;
    };
