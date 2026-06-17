export interface Exames{
    tipoExame: string;
    contagem: number
}

export interface ExamesPeriodo{
    periodo: string,
    exames: Exames[]
}

export interface Estatisticas{
    totalPacientes: number,
    analisesCompletas: number,
    analisesPendentes: number
}

export interface DashProfissionalDTO{
    estatisticas: Estatisticas
    exames: ExamesPeriodo[]
}
