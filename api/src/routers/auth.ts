import { Router } from 'express';
import { realizarLogin } from '../controllers/AuthController';

const router = Router();

router.post('/login', realizarLogin)


export default router;