'use server'
import { cookies } from 'next/headers';
import { servicoGetPessoas, servicoGetMeusDados, servicoPatchPesosas,servicoPatchMeusDados } from './pessoasService';
import { PessoaDTO, ResponsePessoaDTO } from './pessoasDTO';

export async function executarComSessao<T, F = undefined>(
    funcaoServico: (
        token: string,
        perfilAtivo: string,
        filtros?: F
    ) => Promise<T>,
    filtros?: F
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
    return executarComSessao(servicoGetPessoas, filtros);
}

export async function atualizarPessoa(
    dados: Partial<PessoaDTO>
): Promise<string> {
    return executarComSessao(servicoPatchPesosas, dados)
}

export async function buscarMeusDados( ): Promise<ResponsePessoaDTO> {
    return executarComSessao(servicoGetMeusDados);
}

export async function atualizarMeusDados(
    dados?: Partial<PessoaDTO>
): Promise<string> {
    return executarComSessao(servicoPatchMeusDados, dados)
}