export interface ProfissionalDTO{
    idPessoa: string,
    idProfissional: string,
    nome: string,
    profissaoRegistro: string,
    criadoEm: Date,
    atualizadoEm?: Date
}

export type FiltrosBuscaProfissional = {
    nome?: string,
    limit?: string,
    page?: string
}

export interface ProfissionaisMetadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ProfissionaisResponse {
    metadados: ProfissionaisMetadados,
    profissionais: ProfissionalDTO[]
}