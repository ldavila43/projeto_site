export default interface UsuarioModel{
    nome: string,
    data_nascimento: Date,
    documento_identificacao: string,
    sexo: string,
    etnia: string,
    senha_hash: string
}
