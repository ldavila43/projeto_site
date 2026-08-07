import type {
    StatusEnvio
} from '@/src/shared/utils/StatusEnum';

export interface KitEnviado {
    idKit: number;
    codBgk: string;
}

export interface Envio {
    idEnvio: number;
    numeroItens: number;
    itensEnviados: KitEnviado[];
    nomeDestinatario: string;
    status: StatusEnvio;
    dataEnvio: string;
    dataPrazoPostagem: string | null;
    dataChegada: string | null;
    codRastreio: string | null;
    categoriaEnvio: 'KITS';
}

export interface RequestGetEnvios {
    codBgk?: string;
    destinatario?: string;
    dataEnvioIni?: string;
    dataEnvioFim?: string;
    idTipoEnvio?: string;
    dataChegadaIni?: string;
    dataChegadaFim?: string;
    status?: StatusEnvio | '';
    codRastreio?: string;
    dataPrazoPostagemIni?: string;
    dataPrazoPostagemFim?: string;
    page?: string;
    limit?: string;
}

export interface ResponseGetEnvios {
    dados: Envio[];
    metadados: {
        totalRegistros: number;
        totalPaginas: number;
    };
}

export interface RequestPostEnvio {
    idTipoEnvio: number;
    idKits: number[];
    idPessoa: string;
    status?: StatusEnvio;
    dataPrazoPostagem?: string;
    dataEnvio?: string;
    dataChegada?: string;
    codRastreio?: string;
    categoriaEnvio?: 'KITS';
}

export interface RequestPatchEnvio {
    idTipoEnvio?: number;
    status?: StatusEnvio;
    dataPrazoPostagem?: string | null;
    dataEnvio?: string;
    dataChegada?: string | null;
    codRastreio?: string | null;
}

export interface RespostaComandoEnvio {
    message: string;
}
