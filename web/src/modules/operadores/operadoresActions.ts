'use server'
import { cookies } from 'next/headers';
import { servicoGetOperadores, servicoGetRotas, servicoGetPerfis } from './OperadoresService';
import { OperadoresResponse, FiltroBuscaOperadores, ResponseRotasPerfil } from './operadoresDTO';

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
    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, perfilAtivo, filtros);
}
;
export async function buscarDadosOperadores (
    filtros: FiltroBuscaOperadores
): Promise<OperadoresResponse> {
    return executarComSessao(servicoGetOperadores, filtros);
};

export async function buscaRotasOperadores (): Promise<ResponseRotasPerfil> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? '';
    if (!token) {
        throw new Error("Sem token válido")
    }

    return servicoGetRotas(token, perfilAtivo);
}

export async function buscaPerfisOperador() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if(!token) {
        throw new Error("Sem token válido");
    }

    return servicoGetPerfis(token);
}