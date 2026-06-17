import { Router, RequestHandler } from 'express';
import { tokenInterceptor, autorizacaoInterceptor } from '../../interceptors/Interceptor';
import { controllerPacientesAdmin, controllerPacientesProf } from './PacientesController'

const router = Router();

router.get(
    '/profissionais',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0,1]) as RequestHandler,
    controllerPacientesProf
);

router.get(
    '/admin',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0]) as RequestHandler,
    controllerPacientesAdmin
)

export default router;