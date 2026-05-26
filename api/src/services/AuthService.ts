import { buscarCredenciaisPorDocumento } from '../repositories/UserRepository';
import ApiErrors from '../errors/ApiErrors';
import bcrypt from 'bcrypt';
import {OperadorDTO} from '../models/OperadorDTO';
import jwt from 'jsonwebtoken';
import { PayloadUsuario } from '../models/RequestAutenticada';

export async function autenticarUsuario(dados: OperadorDTO) {
    const usuario = await buscarCredenciaisPorDocumento(dados.documentoIdentificacao);

    // if(usuario == null || !await verificarSenha(dados.senhaLogin, usuario.senha_hash)) {
    //     throw new ApiErrors(401, 'Credenciais inválidas');
    // }

    if(usuario == null) {
        throw new ApiErrors(401, 'Credenciais inválidas');
    }
    
    const senhaValida = await verificarSenha(dados.senhaLogin, usuario.senha_hash);

    if (!senhaValida) {
        throw new ApiErrors(401, 'Senha inválida');
    }

    const payload: PayloadUsuario = {
        id: usuario.id_operador,
        nome: usuario.nome,
        perfis: usuario.perfis
    }
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        {expiresIn: '1h'}
    )

    return token;
}

async function verificarSenha(senhaDigitada: string, hashArmazenado: string): Promise<boolean> {
    return await bcrypt.compare(senhaDigitada, hashArmazenado)
}