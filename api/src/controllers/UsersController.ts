import { registrarNovoUsuario } from '../services/UserService'
import { Request, Response } from 'express'
import UsuarioDTO from '../models/UsuarioDTO'
import ApiError from '../errors/ApiErrors'

export async function criarUsuario(req: Request, res: Response) {
    console.log("Cheguei aqui")

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

        console.log('ERRO REAL CAPTURADO:', err);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}