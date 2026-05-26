import LoginDTO from '../DTO/LoginDTO';

export function validarLogin (dados: LoginDTO): {valido:boolean, mensagem?:string} {

    if (!dados.documentoIdentificacao) {
        return {
            valido: false,
            mensagem: 'Obrigatório cadastro de documento de identificação!'
        };
    }
    
    if (dados.senhaLogin.length < 8) {
        return {
            valido: false,
            mensagem: 'A senha deve ter pelo menos 8 caracteres!'
        };
    }

    return {
        valido: true
    };
}