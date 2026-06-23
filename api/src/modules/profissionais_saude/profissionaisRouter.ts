import { Router, RequestHandler } from 'express';
import { tokenInterceptor, autorizacaoPerfilInterceptor } from '../../interceptors/Interceptor';
import { getProfissionais, postProfissionais } from './profissionaisController';

const router = Router();

router.get(
    '/dados',
    tokenInterceptor as RequestHandler,
    autorizacaoPerfilInterceptor,
    getProfissionais
)

router.post(
    '/cadastro',
    tokenInterceptor as RequestHandler,
    autorizacaoPerfilInterceptor,
    postProfissionais
)

export default router;