'use server'
import { cookies } from 'next/headers';
import { servicoPessoas, servicoMeusDados } from './pessoasService';
import { ResponsePessoaDTO } from './pessoasDTO';

export async function executarComSessao<T>(
    funcaoServico: (
        token: string,
        perfilAtivo: string,
        filtros: object
    ) => Promise<T>,
    filtros: object
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? ''
    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, perfilAtivo, filtros);
};

export async function buscarDadosPessoa(
    filtros: object
): Promise<ResponsePessoaDTO> {
    return executarComSessao(servicoPessoas, filtros);
}

export async function buscarMeusDados(
    filtros: object
): Promise<ResponsePessoaDTO> {
    return executarComSessao(servicoMeusDados, filtros);
}

