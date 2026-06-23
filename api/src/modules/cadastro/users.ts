import express from 'express';
import { criarUsuario } from './UsersController'

const router = express.Router();

router.post('/', criarUsuario);

export default router;