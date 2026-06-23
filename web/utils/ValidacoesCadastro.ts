import CadastroDTO from '@/models/CadastroDTO';
import FormDTO from '@/models/FormDTO';

export function validarCadastro(dados: FormDTO): CadastroDTO {

    if (!dados.documentoIdentificacao) {
        throw new Error(
            'Obrigatório cadastro de documento de identificação!'
        );
    }

    if (dados.senha !== dados.confirmarSenha) {
        throw new Error(
            'Digite a mesma senha no campo de confirmação.'
        );
    }

    if (dados.senha.length < 8) {
        throw new Error(
            'A senha deve ter pelo menos 8 caracteres!'
        );
    }

    if (!dados.dataNascimento) {
        throw new Error(
            'Data de nascimento obrigatória!'
        );
    }

    return {
        nome: dados.nome,
        documentoIdentificacao: dados.documentoIdentificacao,
        dataNascimento: new Date(dados.dataNascimento),
        sexo: dados.sexo,
        etnia: dados.etnia,
        senha: dados.senha
    };
}