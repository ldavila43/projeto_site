export interface Exames {
    idExame: number,
    protocolo: string,
    nomePaciente: string,
    tipoExame: string
    documentoPaciente: string,
    nomeProfissional: string,
    dataSolicitacao: Date,
    status: string
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
    nomeProfissional?: string,
    nomePaciente?: string,
    protocolo?: string,
    limit?: number,
    offset?: number
}