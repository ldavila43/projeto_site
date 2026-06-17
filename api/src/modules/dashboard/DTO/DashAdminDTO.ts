export interface Estatisticas {
    colaboradores: Number,
    usuarios: Number
}

export interface SolicitacoesPeriodo {
    periodo: string,
    solicitacoes: number
}

export interface DashAdminDTO {
    estatisticas?: Estatisticas,
    solicitacoesPeriodo?: SolicitacoesPeriodo[],
    anosDisponiveis?: string[]
}