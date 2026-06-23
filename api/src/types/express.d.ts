import { PayloadUsuario } from '../modules/auth/RequestAutenticada'

declare global {
    namespace Express {
        interface Request {
        usuarioLogado?: PayloadUsuario
        perfilAtivo?: number;
        }
    }
}