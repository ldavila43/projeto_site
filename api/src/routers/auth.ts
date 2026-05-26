import { Router } from 'express';
import { realizarLogin } from '../controllers/AuthController';
import { tokenInterceptor } from '../interceptors/Interceptor';

const router = Router();

router.post('/login', realizarLogin)

router.get('/dashboard/dados', tokenInterceptor)


export default router;