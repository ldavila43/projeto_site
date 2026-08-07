import { StatusAmostra } from '@/src/shared/utils/StatusEnum';

export interface FiltrosAmostras {
    idPaciente?: string;
    idProfissional?: string;
    dataIniColeta?: string;
    dataFimColeta?: string;
    dataIniRecebimento?: string;
    dataFimRecebimento?: string;
    dataIniEnvioApoio?: string;
    dataFimEnvioApoio?: string;
    dataIniResultadoApoio?: string;
    dataFimResultadoApoio?: string;
    status?: StatusAmostra | '';
    tipoAmostra?: string;
    nomePaciente?: string;
    nomeProfissional?: string;
    page?: string;
    limit?: string;
}

export interface Amostra {
    idAmostra: string;
    nomePaciente: string;
    nomeProfissional: string | null;
    status: StatusAmostra;
    observacoes: string | null;
    flagRecoleta: boolean;
    dataColeta: string | null;
    dataRecebimento: string | null;
    dataEnvioApoio: string | null;
    dataResultadoApoio: string | null;
    tipoAmostra: string;
    protocolosVinculados: string[];
}

export interface ResponseAmostras {
    metadados: {
        totalRegistros: number;
        totalPaginas: number;
    };
    amostras: Amostra[];
}
