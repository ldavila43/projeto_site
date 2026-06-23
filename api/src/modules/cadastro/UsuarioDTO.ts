export interface UsuarioDTO{
    nome: string,
    dataNascimento: Date,
    documentoIdentificacao: string,
    sexo: string,
    etnia: string,
    senha: string
}

export interface UsuarioModel{
    nome: string,
    dataNascimento: Date,
    documentoIdentificacao: string,
    sexo: string,
    etnia: string,
    senhaHash: string
}
