import { Router, RequestHandler } from 'express';
import { tokenInterceptor, autorizacaoInterceptor, autorizacaoPerfilInterceptor } from '../../interceptors/Interceptor';
import { getPacientes, postPacientes } from './PacientesController'

const router = Router();

router.get(
    '/dados',
    tokenInterceptor as RequestHandler,
    autorizacaoPerfilInterceptor,
    getPacientes
)

router.post(
    '/cadastro',
    tokenInterceptor as RequestHandler,
    autorizacaoPerfilInterceptor,
    postPacientes
)

export default router;