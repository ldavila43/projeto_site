import express from 'express';
import cors from 'cors';
import authRouter from './modules/auth/auth';
import usersRouter from './modules/cadastro/users';
import examesRouter from './modules/exames/examesRouter';
import pacientesRouter from './modules/pacientes/pacientesRouter';
import dashboardRouter from './modules/dashboard/dashboard';
import profissionaisRouter from './modules/profissionais_saude/profissionaisRouter';
import pool from './config/DatabaseConfig';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.use('/users', usersRouter);

app.use ('/dashboard', dashboardRouter);

app.use('/exames', examesRouter);

app.use('/pacientes', pacientesRouter);

app.use('/profissionais-saude', profissionaisRouter);

iniciarServidor();

async function iniciarServidor() {
    try {
        const client = await pool.connect()
        await client.query('select 1');
        client.release();
        app.listen(3002, () => {
            console.log('Servidor rodando na porta 3002');
        })
    } catch (erro) {
        console.log('ERRO ' + erro);
    }
}