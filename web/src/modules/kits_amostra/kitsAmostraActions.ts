'use server'
import { cookies } from 'next/headers';
import { servicoGetKits } from './kitsAmostraService';
import { ResponseGetKits, RequestGetKits } from './KitsAmostraDTO';

export async function executarComSessao<T>(
    funcaoServico: (
        token: string,
        perfilAtivo: string,
        filtros: RequestGetKits
    ) => Promise<T>,
    filtros: RequestGetKits
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? ''
    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, perfilAtivo, filtros);
}
;
export async function buscarDadosKitsAmostra (
    filtros: RequestGetKits
): Promise<ResponseGetKits> {
    return executarComSessao(servicoGetKits, filtros);
};

