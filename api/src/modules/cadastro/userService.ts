import { buscaPorCpf, criarConta } from './userRepository';
import {UsuarioDTO, UsuarioModel} from './UsuarioDTO';
import ApiErrors from '../../errors/ApiErrors';
import bcrypt from 'bcrypt';

export async function registrarNovoUsuario(dados: UsuarioDTO) {
    if (dados.senha.length < 8) {
        throw new ApiErrors(401, 'Senha deve ser maior que 8 dígitos');
    }
    if (await buscaPorCpf(dados.documentoIdentificacao)) {
        throw new ApiErrors(409, 'CPF já cadastrado');
    }
    
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(dados.senha, saltRounds);

    const usuarioModel: UsuarioModel = {
        nome: dados.nome,
        dataNascimento: dados.dataNascimento,
        documentoIdentificacao: dados.documentoIdentificacao,
        sexo: dados.sexo,
        etnia: dados.etnia,
        senhaHash: senhaHash
    };

    await criarConta(usuarioModel);

    return true;
}
