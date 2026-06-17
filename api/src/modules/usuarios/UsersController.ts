import { registrarNovoUsuario } from './UserService'
import { Request, Response } from 'express'
import UsuarioDTO from './UsuarioDTO'
import ApiError from '../../errors/ApiErrors'

export async function criarUsuario(req: Request, res: Response) {
    const dadosUsuario: UsuarioDTO = req.body;

    try {
        await registrarNovoUsuario(dadosUsuario);

        return res.status(201).json({
            message: 'Usuário criado com sucesso'
        });
    } catch(err) {
        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({
                error: err.message
            })
        }

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}