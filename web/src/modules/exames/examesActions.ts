'use server'
import { cookies } from 'next/headers';
import { servicoExames } from '@/src/modules/exames/ExamesService';
import { ExamesDTO, FiltrosBuscaExame } from '@/src/modules/exames/ExamesDTO';

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
export async function buscarDadosExames (
    filtros: FiltrosBuscaExame
): Promise<ExamesDTO> {
    return executarComSessao(servicoExames, filtros);
};

