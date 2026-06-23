import { Router, RequestHandler } from 'express';
import { tokenInterceptor, autorizacaoPerfilInterceptor } from '../../../interceptors/Interceptor';
import { getDadosVisaoGeral } from './resultadoController';


const router = Router();

router.get('/:id/resultados/visao-geral', 
    tokenInterceptor as RequestHandler,
    autorizacaoPerfilInterceptor as RequestHandler,
    getDadosVisaoGeral
);

export default router;