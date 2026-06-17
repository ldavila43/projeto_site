import { Router, RequestHandler } from 'express';
import { tokenInterceptor, autorizacaoInterceptor } from '../../interceptors/Interceptor';
import { 
    dadosDashPacientes, 
    dadosDashProfissionais, 
    dadosDashAdmin, 
    dadosSolicitacoesAdmin, 
    dadosCardResumoColaborador,
    dadosTipoExameColaborador
} from './DashboardController'

const router = Router();

router.get(
    '/pacientes/meus-dados',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0,3]) as RequestHandler,
    dadosDashPacientes
);

router.get(
    '/profissionais/meus-dados',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0,1]) as RequestHandler,
    dadosDashProfissionais
);

router.get(
    '/laboratorio/cards-resumo',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0, 2]) as RequestHandler,
    dadosCardResumoColaborador
)

router.get(
    '/laboratorio/grafico-exames',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0, 2]) as RequestHandler,
    dadosTipoExameColaborador
)

router.get(
    '/admin',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0]) as RequestHandler,
    dadosDashAdmin
)

router.get(
    '/admin/solicitacoes',
    tokenInterceptor as RequestHandler,
    autorizacaoInterceptor([0]) as RequestHandler,
    dadosSolicitacoesAdmin
)

export default router;