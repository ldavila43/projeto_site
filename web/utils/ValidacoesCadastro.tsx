import Cadastro from '../DTO/CadastroDTO'

export function validarCadastro(dados: Cadastro) {
    try {
        if (!dados.documentoIdentificacao) {
            throw new Error('Obrigatório cadastro de documento de identificação!');
        }

        if (dados.senha.length < 8) {
            throw new Error('A senha deve ter pelo menos 8 caracteres!');
        }

        if (!dados.dataNascimento) {
            throw new Error('Data de nascimento obrigatória!');
        }

        return {
            sucesso: true,
            mensagem: null
        };

    } catch (err) {
        return {
            sucesso: false,
            mensagem: err instanceof Error ? err.message : 'Erro desconhecido'
        };
    }
}