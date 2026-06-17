import { Router, RequestHandler } from 'express';
import { tokenInterceptor, autorizacaoInterceptor } from '../../interceptors/Interceptor';
import { controladorExamesPacientes, controladorExamesProfissionais, controladorExamesAdmin } from './ExamesController'

const router = Router();

router.get(
    '/pacientes/meus-dados',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0,3]) as RequestHandler,
    controladorExamesPacientes
);

router.get(
    '/profissionais/meus-dados',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0,1]) as RequestHandler,
    controladorExamesProfissionais
);

router.get(
    '/admin',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0, 2]) as RequestHandler,
    controladorExamesAdmin
);

export default router;