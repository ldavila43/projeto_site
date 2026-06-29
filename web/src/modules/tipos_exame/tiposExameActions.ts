'use server'
import { cookies } from 'next/headers';
import { servicoTiposExame } from './tiposExameService';
import { ResponseGetTiposExame, RequestGetTiposExame } from './TiposExameDTO';

export async function executarComSessao<T>(
    funcaoServico: (
        token: string,
        perfilAtivo: string,
        filtros: RequestGetTiposExame
    ) => Promise<T>,
    filtros: RequestGetTiposExame
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
export async function buscarDadosTiposExame (
    filtros: RequestGetTiposExame
): Promise<ResponseGetTiposExame> {
    return executarComSessao(servicoTiposExame, filtros);
};

