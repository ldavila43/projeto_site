import { Router, RequestHandler } from 'express';
import { tokenInterceptor, autorizacaoInterceptor } from '../interceptors/Interceptor';
import { dadosDashPacientes, dadosDashProfissionais, dadosDashAdmin } from '../controllers/DashboardController'

const router = Router();

router.get(
    '/dados/pacientes/meus-dados',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0,3]) as RequestHandler,
    dadosDashPacientes
);

router.get(
    '/dados/profissionais/meus-dados',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0,1]) as RequestHandler,
    dadosDashProfissionais
);

router.get(
    '/dados/admin',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0]) as RequestHandler,
    dadosDashAdmin
)

export default router;