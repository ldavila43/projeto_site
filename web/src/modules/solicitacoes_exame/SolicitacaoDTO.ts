export interface RequestPostSolicitacaoDTO{
    idPaciente: string,
    idProfissional?: string,
    dataSolicitacao: Date,
    statusSolicitacao?: string,
    protocolo: string,
    idKits: number[],
    exames: ExamesDTO[]
}

export interface ExamesDTO {
    idTipoExame: number,
    descricao?: string
}


export interface RequestSolicitacoesDTO {
    idPaciente?: string,
    idProfissional?: string,
    dataIni?: Date,
    dataFim?: Date,
    status?:string,
    protocolo?: string,
    nomePaciente?: string,
    nomeProfissional?: string,
    limit?: number,
    page?: string
}
export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface SolicitacoesExame {
    idSolicitacao: string,
    protocolo: string,
    nomePaciente: string,
    nomeProfissional?: string,
    dataSolicitacao: string,
    statusSolicitacao: string,
    quantidadeExames: string,
    tiposExame: string[]
}

export interface GetSolicitacoesResponse{
    metadados: Metadados,
    solicitacoes: SolicitacoesExame[]
}