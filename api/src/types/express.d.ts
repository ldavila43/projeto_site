import { PayloadUsuario } from '../models/RequestAutenticada'

declare global {
    namespace Express {
        interface Request {
        usuarioLogado?: PayloadUsuario
        }
    }
}