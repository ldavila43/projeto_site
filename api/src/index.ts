import express from 'express';
import cors from 'cors';
import authRouter from './routers/auth';
import usersRouter from './routers/users';
import dashboardRouter from './routers/dashboard'
import pool from './config/DatabaseConfig'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.use('/users', usersRouter);

app.use ('/dashboard', dashboardRouter);

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