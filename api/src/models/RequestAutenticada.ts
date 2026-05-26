import jwt from 'jsonwebtoken';
import { Request } from 'express'

export interface PayloadUsuario {
    id: string;
    nome: string,
    perfis: number[]
}

export interface RequestComUsuario extends Request {
    usuarioLogado?: PayloadUsuario;
}