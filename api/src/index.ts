import express from 'express';
import cors from 'cors';
import authRouter from './routers/auth';
import usersRouter from './routers/users';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter)

app.use('/users', usersRouter)

app.listen(3002);
