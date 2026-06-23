
export interface SolicitacoesPeriodo{
    periodo: string,
    solicitacoes: Number
}

export interface Estatisticas{
    colaboradores: number,
    usuarios: number
}

export interface DashAdminDTO{
    estatisticas?: Estatisticas
    solicitacoesPeriodo?: SolicitacoesPeriodo[],
    anosDisponiveis?: string[]
}
