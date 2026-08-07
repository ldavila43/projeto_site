
export interface Exames{
    protocolo: string,
    tipoExame: string,
    status: string,
    dataSolicitacao: string
}

export interface Estatisticas{
    total: number,
    concluidos: number
}

export interface DashPacientesDTO{
    estatisticas: Estatisticas
    exames: Exames[]
}
