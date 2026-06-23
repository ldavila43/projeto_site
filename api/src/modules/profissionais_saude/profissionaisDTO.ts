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
    idProfissao: number,
    complemento?: string,
    sexo?: string,
    etnia?: string,
}

export interface ProfissionalDTO{
    idPessoa: string,
    idProfissional: string,
    nome: string,
    profissaoRegistro: string,
    criadoEm: Date,
    atualizadoEm?: Date
}
export interface ProfissionaisMetadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ProfissionaisRequest {
    nome?: string,
    limit?: number,
    offset?: number
}

export interface ProfissionaisResponse {
    metadados: ProfissionaisMetadados,
    profissionais: ProfissionalDTO[]
}