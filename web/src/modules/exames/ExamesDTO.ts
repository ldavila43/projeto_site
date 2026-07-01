export interface Exames {
    idExame: number,
    protocolo: string,
    nomePaciente: string,
    tipoExame: string
    documentoPaciente: string,
    nomeProfissional: string,
    dataSolicitacao: string,
    status: string
}

export type FiltrosBuscaExame = {
    idPaciente?: string;
    idProfissional?: string;
    tipoExame?: string;
    nomePaciente?: string,
    nomeProfissional?: string,
    protocolo?: string,
    status?: string,
    limit?: string,
    page?: string
}

export interface ExamesMetadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ExamesDTO {
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