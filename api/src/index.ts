import express from 'express';
import cors from 'cors';
import authRouter from './routers/auth';
import usersRouter from './routers/users';
import pool from './config/DatabaseConfig'


const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter)

app.use('/users', usersRouter)

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