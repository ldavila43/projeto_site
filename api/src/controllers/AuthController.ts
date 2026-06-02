import { autenticarUsuario } from '../services/AuthService';
import { Request, Response } from 'express';
import { OperadorDTO } from '../models/OperadorDTO';
import ApiError from '../errors/ApiErrors';

export async function realizarLogin(req: Request, res: Response) {
    const dadosLogin: OperadorDTO = req.body;
    try {
        const token = await autenticarUsuario(dadosLogin);

        return res.status(200).json({
            message: 'Login Autenticado!',
            token: token
        })
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