'use server'
import { cookies } from 'next/headers'
import { enviarLogin } from '@/services/AuthService'
import LoginDTO from '@/DTO/LoginDTO'


export async function actionLogin(dados: LoginDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
    try{
        const cookieStore = await cookies();
        const token = await enviarLogin(dados);
        console.log(token);
        cookieStore.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60
        });
        return {
            sucesso: true,
            mensagem: 'Login Realizado com Sucesso!'
        };

    } catch(erro) {
        if (erro instanceof Error) {
            return {
                sucesso: false,
                mensagem: erro.message
            };
        }
        return {
            sucesso: false,
            mensagem: 'Erro Desconhecido'
        };
    }
}

export async function actionLogout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return true;
}