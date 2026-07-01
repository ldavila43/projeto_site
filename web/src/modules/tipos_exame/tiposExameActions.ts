'use server'
import { cookies } from 'next/headers';
import { servicoGetTiposExame, servicoPostTipoExame } from './tiposExameService';
import { ResponseGetTiposExame, RequestGetTiposExame, RequestPostTipoExame } from './TiposExameDTO';

export async function executarComSessao<T, D>(
    funcaoServico: (
        token: string,
        perfilAtivo: string,
        dados: D
    ) => Promise<T>,
    dados: D
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? '';

    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, perfilAtivo, dados);
};

export async function buscarDadosTiposExame (
    filtros: RequestGetTiposExame
): Promise<ResponseGetTiposExame> {
    return executarComSessao(servicoGetTiposExame, filtros);
};

export async function criarTipoExame (
    filtros: RequestPostTipoExame
): Promise<void> {
    return executarComSessao(servicoPostTipoExame, filtros);
};

