
export interface PessoaDTO {
    idPessoa: string,
    nome?: string,
    documentoIdentificacao?: string,
    sexo?: string,
    etnia?: string
}

export interface PessoasEmail {
    idPessoa: string,
    email: string,
    tipo: string
}

export interface PessoasTelefone {
    idPessoa: string,
    telefone: string,
    tipo: string
}

export interface Endereco {
    idEndereco: string,
    tipoEndereco: string,
    cep: string,
    logradouro: string,
    numero: string,
    complemento: string,
    bairro: string,
    idCidade: number,
    cidade: string,
    estado: string,
    pais: string
}

export interface ResponsePessoaDTO {
    dadosPessoa: PessoaDTO,
    telefones: PessoasTelefone[],
    emails: PessoasEmail[],
    enderecos: Endereco[]
}