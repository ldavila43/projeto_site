import express from 'express';
import { criarUsuario } from './usersController'

const router = express.Router();

router.post('/', criarUsuario);

export default router;