export default interface CadastroDTO {
    nome: string;
    documentoIdentificacao: string;
    dataNascimento: string;
    sexo: 'MASCULINO' | 'FEMININO';
    etnia: string;
    senha: string;
}
