'use server'
import { cookies } from 'next/headers';
import {servicoExamesPaciente, servicoExamesProfissional, servicoExamesAdmin} from '@/services/ExamesService';
import { ExamesDTO, FiltrosBuscaExame } from '@/models/ExamesDTO';

export async function executarComSessao<T>(
    funcaoServico: (
        token: string,
        filtros: FiltrosBuscaExame,
        perfilAtivo: string
    ) => Promise<T>,
    filtros: FiltrosBuscaExame
): Promise<T> {
    const cookieStore = await cookies();

    const token = cookieStore.get('session')?.value;

    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? ''

    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, filtros, perfilAtivo);
}
;
export async function buscarDadosExamesPaciente(
    filtros: FiltrosBuscaExame
): Promise<ExamesDTO> {
    return executarComSessao(servicoExamesPaciente, filtros);
};

export async function buscarDadosExamesProfissional(
    filtros: FiltrosBuscaExame
): Promise<ExamesDTO> {
    return executarComSessao(servicoExamesProfissional, filtros);
}

export async function buscarDadosExamesAdmin(
    filtros: FiltrosBuscaExame
): Promise<ExamesDTO> {
    return executarComSessao(servicoExamesAdmin, filtros);
}
