export interface ProfissionalDTO{
    idPessoa: string,
    idProfissional: string,
    nome: string,
    profissaoRegistro: string,
    criadoEm: string,
    atualizadoEm?: string
}

export type FiltrosBuscaProfissional = {
    nome?: string,
    documentoProfissional?: string,
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

export interface RequestPostProfissional {
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
    tipoEndereco: string;
    idCidade: number;
    idProfissao: number;
    complemento: string;
    sexo: 'MASCULINO' | 'FEMININO';
    etnia: string;
}
