import { Router } from 'express';
import { tokenInterceptor } from '../interceptors/Interceptor';
import { dadosDashPacientes } from '../controllers/DashboardController'

const router = Router();

router.get('/dados/pacientes/meus-dados', tokenInterceptor, dadosDashPacientes);

export default router;