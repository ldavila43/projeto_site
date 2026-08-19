import { StatusSolicitacao } from '@/src/shared/utils/StatusEnum';

export type DecisaoAmostraGenetica =
    | {
        acao: 'SOLICITAR_NOVA_COLETA';
    }
    | {
        acao: 'VINCULAR_EXISTENTE';
        idAmostra: number;
    };

export interface RequestPostSolicitacaoDTO {
    idPaciente: string;
    idProfissional?: string;
    dataSolicitacao?: string;
    statusSolicitacao?: StatusSolicitacao;
    quantidadeKits: number;
    idKits?: number[];
    idsTiposExames: number[];
    decisaoAmostraGenetica?: DecisaoAmostraGenetica;
}

export interface AmostraGeneticaExistente {
    idAmostra: number;
    idKit?: number;
    idTipoAmostra: number;
    tipoAmostra: 'GENETICO';
    status: string;
    dataColeta: string;
    flagRecoleta: boolean;
    observacoes?: string;
    protocolosVinculados: string[];
    elegivelParaVinculo: boolean;
    motivosInelegibilidade: string[];
}

export interface DetalhesConflitoAmostraGenetica {
    tipoAmostra: {
        idTipoAmostra: number;
        descricao: 'GENETICO';
    };
    amostras: AmostraGeneticaExistente[];
}

export type ResultadoCadastroSolicitacao =
    | {
        sucesso: true;
        mensagem: string;
    }
    | {
        sucesso: false;
        tipo: 'CONFLITO_AMOSTRA_GENETICA';
        conflito: DetalhesConflitoAmostraGenetica;
    }
    | {
        sucesso: false;
        tipo: 'ERRO_API';
        codigo: string;
        mensagem: string;
    };

export type ResultadoAcaoSolicitacao =
    | {
        sucesso: true;
        mensagem: string;
    }
    | {
        sucesso: false;
        codigo: string;
        mensagem: string;
    };

export interface RequestPostAmostraSolicitacaoDTO {
    idTipoAmostra: number;
    idKit?: number;
    observacoes?: string;
    flagRecoleta: boolean;
    flagPesquisa: boolean;
    dataColeta: string;
    dataRecebimento?: string;
    identificacaoDosTubos?: string;
}

export interface KitOpcaoAmostraSolicitacao {
    idKit: number;
    codBgk: string;
    status: 'INATIVO' | 'ATIVO';
    elegivelParaUso: boolean;
    motivosInelegibilidade: string[];
}

export interface OpcaoAmostraSolicitacao {
    idTipoAmostra: number;
    descricao: string;
    situacao: 'NOVA' | 'RECOLETA' | 'CONTEMPLADA';
    elegivelParaCriacao: boolean;
    flagRecoletaObrigatoria: boolean;
    motivosInelegibilidade: string[];
    kits: KitOpcaoAmostraSolicitacao[];
}

export interface ResponseOpcoesAmostraSolicitacao {
    idSolicitacao: number;
    podeCriarAmostra: boolean;
    motivosInelegibilidade: string[];
    opcoes: OpcaoAmostraSolicitacao[];
}


export interface RequestSolicitacoesDTO {
    idPaciente?: string,
    idProfissional?: string,
    dataIni?: string,
    dataFim?: string,
    status?: StatusSolicitacao | '',
    protocolo?: string,
    nomePaciente?: string,
    nomeProfissional?: string,
    limit?: string,
    page?: string
}
export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface SolicitacoesExame {
    idSolicitacao: number,
    protocolo: string | null,
    nomePaciente: string,
    nomeProfissional?: string,
    dataSolicitacao: string,
    statusSolicitacao: StatusSolicitacao,
    quantidadeExames: number,
    quantidadeKits: number,
    tiposExame: string[],
    podeVincularKit: boolean,
    podeCriarAmostra: boolean,
    kitsVinculados: number,
    amostrasVinculadas: number,
    kitsPendentes: number,
    amostrasPendentes: number
}

export interface GetSolicitacoesResponse{
    metadados: Metadados,
    solicitacoes: SolicitacoesExame[]
}
