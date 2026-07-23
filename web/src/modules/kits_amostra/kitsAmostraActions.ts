'use server'
import { cookies } from 'next/headers';
import { servicoGetKits, servicoPostKit } from './kitsAmostraService';
import { ResponseGetKits, RequestGetKits, RequestPostKitAmostra } from './KitsAmostraDTO';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

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
    if (!perfilAtivo) {
        throw new Error("Perfil ativo não informado");
    }

    return funcaoServico(token, perfilAtivo, dados);
}

export async function buscarDadosKitsAmostra (
    filtros: RequestGetKits
): Promise<ResponseGetKits> {
    return executarComSessao(servicoGetKits, filtros);
}

export async function cadastrarKitAmostra(
    dados: RequestPostKitAmostra
): Promise<void> {
    const cookieStore = await cookies();
    const perfilAtivo = Number(cookieStore.get('x-perfil-ativo')?.value);

    if (perfilAtivo !== PERFIS.ADMINISTRADOR && perfilAtivo !== PERFIS.COLABORADOR) {
        throw new Error("Perfil sem permissão para cadastrar kits de amostra");
    }

    return executarComSessao(servicoPostKit, dados);
}
