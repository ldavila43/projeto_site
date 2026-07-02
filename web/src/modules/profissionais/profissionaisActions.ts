'use server'
import { cookies } from 'next/headers';
import { servicoGetProfissionais } from './profissionaisService';
import { FiltrosBuscaProfissional, ProfissionaisResponse } from './profissionaisDTO';

export async function executarComSessao<T>(
    funcaoServico: (
        token: string,
        perfilAtivo: string,
        filtros: FiltrosBuscaProfissional
    ) => Promise<T>,
    filtros: FiltrosBuscaProfissional
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? ''
    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, perfilAtivo, filtros);
};

export async function buscarDadosProfissionais(
    filtros: FiltrosBuscaProfissional
): Promise<ProfissionaisResponse> {
    return executarComSessao(servicoGetProfissionais, filtros);
}
