'use server'
import { cookies } from 'next/headers';
import { enviarLogin } from '@/src/modules/auth/AuthService';
import LoginDTO from '@/src/modules/auth/LoginDTO';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { jwtDecode } from 'jwt-decode';
import { PayloadUsuario } from '@/src/shared/PayloadUsuario';
import { obterPerfilPrioritario, PerfilID, PERFIS, isPerfilID } from '@/src/shared/utils/PerfisEnum';
import CadastroDTO from './CadastroDTO';
import { registrarUsuario } from './UserService';
import { obterSessao } from '@/src/shared/server/sessao';

type ResultadoLogin = {
    sucesso: boolean;
    mensagem?: string;
    perfilAtivo?: PerfilID;
};

export async function actionLogin(dados: LoginDTO): Promise<ResultadoLogin> {
    try{
        const cookieStore = await cookies();
        const token = await enviarLogin(dados);
        const payload = jwtDecode<PayloadUsuario>(token);
        const perfilAtivo = obterPerfilPrioritario(payload.perfis ?? []);

        if (!perfilAtivo) {
            throw new Error('Usuário não possui um perfil válido');
        }

        cookieStore.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 *24
        });
        cookieStore.set('x-perfil-ativo', String(perfilAtivo), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60
        });

        return {
            sucesso: true,
            mensagem: 'Login Realizado com Sucesso!',
            perfilAtivo
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
    cookieStore.delete('x-perfil-ativo');
    redirect('/login')
}

export async function actionAlterarPerfil(novoPerfil: string, rotaDestino?: string) {
    const { usuario } = await obterSessao({ exigirPerfil: false });
    const cookieStore = await cookies();
    const perfil = Number(novoPerfil);

    if (!isPerfilID(perfil) || !usuario.perfis.some(({ id }) => id === perfil)) {
        throw new Error('Perfil inválido para este usuário');
    }

    cookieStore.set('x-perfil-ativo', String(perfil), {
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

export async function cadastrarUsuario(dados: CadastroDTO): Promise<string> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR]
    });
    const resposta = await registrarUsuario(token, String(perfilAtivo), dados);
    return resposta.message;
}
