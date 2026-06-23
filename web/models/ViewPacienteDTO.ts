
export interface Exames{
    protocolo: string,
    tipoExame: string,
    status: string,
    dataSolicitacao: Date
}

export interface Estatisticas{
    total: number,
    concluidos: number
}

export interface DashPacientesDTO{
    estatisticas: Estatisticas
    exames: Exames[]
}
