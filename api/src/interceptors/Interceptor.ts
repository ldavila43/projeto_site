import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { PayloadUsuario, RequestComUsuario } from '../models/RequestAutenticada';

export function tokenInterceptor(req: RequestComUsuario, res: Response, next: NextFunction) {
    const authorization = req.header('authorization');

    if (!authorization) {
        return res.status(401).json({
            error: 'Token não enviado'
        });
    }

    const token = authorization.split(' ')[1];

    try {
        const payload: PayloadUsuario = jwt.verify(token, process.env.JWT_SECRET!) as PayloadUsuario;

        if(!validaPayload(payload)) {
            return res.status(401).json({
                error: 'Token inválido'
            });
        }
        req.usuarioLogado = payload;
        next();

    } catch (erro) {
        return res.status(401).json({
            error: 'Token inválido'
        });
    }
}


function validaPayload(payload: PayloadUsuario) {
    if (!payload.id || !payload.nome || !payload.perfis) {
        return false;
    }
    if (typeof payload.id !== 'string') {
        return false;
    }
    if (typeof payload.nome !== 'string') {
        return false;
    }
    if (!Array.isArray(payload.perfis)) {
        return false;
    }
    return true;
}

export function autorizacaoInterceptor(perfisPermitidos:number[]) {
    return function (req: RequestComUsuario, res: Response, next: NextFunction) {
    const perfis = req.usuarioLogado.perfis;

    if (!perfis) {
        return res.status(401).json({
            error:'Usuario não autenticado'
        })
    }

    const passa = perfis.some(valor => perfisPermitidos.includes(valor));

    if (!passa) {
        return res.status(403).json({
            error: 'Acesso inválido'
        })
    }

    next();
    }
}