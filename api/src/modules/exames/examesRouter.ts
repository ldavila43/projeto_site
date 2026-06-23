import { Router, RequestHandler } from 'express';
import { tokenInterceptor, autorizacaoPerfilInterceptor } from '../../interceptors/Interceptor';
import { controladorExames } from './ExamesController'
import { getDadosVisaoGeral } from './resultados/resultadoController';


const router = Router();

router.get('/:idExame/visao-geral', 
    tokenInterceptor as RequestHandler,
    autorizacaoPerfilInterceptor as RequestHandler,
    getDadosVisaoGeral
);

router.get(
    '/dados',
    tokenInterceptor as RequestHandler,
    autorizacaoPerfilInterceptor as RequestHandler,
    controladorExames
);

export default router;