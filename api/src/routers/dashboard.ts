import { Router, RequestHandler } from 'express';
import { tokenInterceptor } from '../interceptors/Interceptor';
import { dadosDashPacientes, dadosDashProfissionais, dadosDashAdmin } from '../controllers/DashboardController'

const router = Router();

router.get('/dados/pacientes/meus-dados', tokenInterceptor as RequestHandler, dadosDashPacientes);
router.get('/dados/profissionais/meus-dados', tokenInterceptor as RequestHandler, dadosDashProfissionais);
router.get('/dados/admin', tokenInterceptor as RequestHandler, dadosDashAdmin)

export default router;