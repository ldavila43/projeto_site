export interface ReqCadastroDTO {
    nome: string,
    documentoIdentificacao: string,
    nascimento: string,
    email: string,
    telefone: string,
    tipoContato: string,
    cep: string,
    logradouro: string,
    numero: string,
    bairro: string,
    idCidade: number,
    tipoEndereco: string,
    estadoCivil?: string,
    profissao?: string,
    complemento?: string,
    sexo?: string,
    etnia?: string,
}

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