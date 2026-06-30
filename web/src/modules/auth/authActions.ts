'use server'
import { cookies } from 'next/headers';
import { enviarLogin } from '@/src/modules/auth/AuthService';
import LoginDTO from '@/src/modules/auth/LoginDTO';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


export async function actionLogin(dados: LoginDTO): Promise<{ sucesso: boolean; mensagem?: string }> {
    try{
        const cookieStore = await cookies();
        const token = await enviarLogin(dados);
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
    redirect('/login')
}

export async function actionAlterarPerfil(novoPerfil: string, rotaDestino?: string) {
    const cookieStore = await cookies();

    cookieStore.set('x-perfil-ativo', novoPerfil, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60
    });

    if (rotaDestino) {
        redirect(rotaDestino);
    } else {
        revalidatePath('/', 'layout');
    }
}