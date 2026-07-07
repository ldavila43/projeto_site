'use server'
import { cookies } from 'next/headers';
import { servicoGetTiposKitAmostra } from './tiposKitAmostraService';
import { RequestGetTiposKit, ResponseGetTiposKit } from './TiposKitAmostraDTO';

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

export async function buscarDadosTiposKitAmostra (
    filtros: RequestGetTiposKit
): Promise<ResponseGetTiposKit> {
    return executarComSessao(servicoGetTiposKitAmostra, filtros);
};

