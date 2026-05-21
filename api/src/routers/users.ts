import express from 'express';
import { criarUsuario } from '../controllers/UsersController'

const router = express.Router();

router.post('/', criarUsuario);

export default router;