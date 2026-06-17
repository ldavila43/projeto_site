

export interface PacienteDTO{
    idPessoa: string,
    idPaciente: string,
    nome: string,
    criadoEm: Date,
    atualizadoEm?: Date
}
export interface PacientesMetadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface PacienteRequest {
    nome?: string,
    idProfissional?: string,
    limit?: number,
    offset?: number
}

export interface PacienteResponse {
    metadados: PacientesMetadados,
    pacientes: PacienteDTO[]
}