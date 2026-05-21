import { buscaPorCpf, criarConta } from '../repositories/UserRepository';
import UsuarioDTO from '../models/UsuarioDTO';
import UsuarioModel from '../models/UsuarioModel'
import ApiErrors from '../errors/ApiErrors';
import bcrypt from 'bcrypt';

export async function registrarNovoUsuario(dados: UsuarioDTO) {
    if (dados.senha.length < 8) {
        throw new ApiErrors(401, 'Senha deve ser maior que 8 dígitos');
    }
    if (await buscaPorCpf(dados.documento_identificacao)) {
        throw new ApiErrors(409, 'CPF já cadastrado');
    }

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(dados.senha, saltRounds);

    const usuarioModel: UsuarioModel = {
        nome: dados.nome,
        data_nascimento: dados.data_nascimento,
        documento_identificacao: dados.documento_identificacao,
        sexo: dados.sexo,
        etnia: dados.etnia,
        senha_hash: senhaHash
    };

    await criarConta(usuarioModel);

    return true;
}
