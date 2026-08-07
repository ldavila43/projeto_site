import { StatusExame } from '@/src/shared/utils/StatusEnum';

export interface Exames {
    idExame: number,
    protocolo: string,
    nomePaciente: string,
    tipoExame: string
    documentoPaciente: string,
    nomeProfissional: string | null,
    dataSolicitacao: string,
    status: StatusExame
    categoriaExame: number | null
}

export interface VisaoGeralExame {
    composicaoDominio: Array<{
        especie: string;
        abundancia: number;
    }>;
    bacilotaBacteroidota?: {
        razao: number;
        bacilota: number;
        bacteroidota: number;
    };
    topVias: Array<{
        nomeVia: string;
        abundancia: string | number;
    }>;
    severidadePersistencia: Array<{
        tipo: string;
        abundancia: string | number;
    }>;
}

export type FiltrosBuscaExame = {
    idPaciente?: string;
    idProfissional?: string;
    tipoExame?: string;
    nomePaciente?: string,
    nomeProfissional?: string,
    protocolo?: string,
    status?: StatusExame | '',
    limit?: string,
    page?: string
}

export interface ExamesMetadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ExamesResponseDTO {
    dados: Exames[]
    metadados: ExamesMetadados
}

export interface RequestExames {
    idPaciente?: string,
    idProfissional?: string,
    tipoExame?: string,
    protocolo?: string,
    limit?: number,
    offset?: number
}
