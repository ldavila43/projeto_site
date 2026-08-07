

export interface PacienteDTO{
    idPessoa: string,
    idPaciente: string,
    nome: string,
    criadoEm: string,
    atualizadoEm?: string
}

export type FiltrosBuscaPaciente = {
    nome?: string,
    documentoPaciente?: string,
    idProfissional?: string,
    limit?: string,
    page?: string
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

export interface RequestPostPaciente {
    nome: string;
    documentoIdentificacao: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    tipoContato: string;
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    idCidade: number;
    tipoEndereco: string;
    estadoCivil: string;
    profissao: string;
    complemento: string;
    sexo: 'MASCULINO' | 'FEMININO';
    etnia: string;
}
