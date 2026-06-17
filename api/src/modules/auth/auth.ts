import { Router } from 'express';
import { realizarLogin } from './AuthController';

const router = Router();

router.post('/login', realizarLogin)


export default router;