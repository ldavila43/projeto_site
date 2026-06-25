'use server'
import { cookies } from 'next/headers';
import { servicoOperadores } from './OperadoresService';
import { OperadoresResponse, FiltroBuscaOperadores } from './operadoresDTO';

export async function executarComSessao<T>(
    funcaoServico: (
        token: string,
        perfilAtivo: string,
        filtros: FiltroBuscaOperadores
    ) => Promise<T>,
    filtros: FiltroBuscaOperadores
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? ''
    console.log('Perfil Ativo: ' + perfilAtivo)
    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, perfilAtivo, filtros);
}
;
export async function buscarDadosOperadores (
    filtros: FiltroBuscaOperadores
): Promise<OperadoresResponse> {
    return executarComSessao(servicoOperadores, filtros);
};

