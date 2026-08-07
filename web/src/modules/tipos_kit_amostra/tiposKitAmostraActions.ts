'use server'

import { servicoGetTiposKitAmostra } from './tiposKitAmostraService';
import { RequestGetTiposKit, ResponseGetTiposKit } from './TiposKitAmostraDTO';
import { obterSessao } from '@/src/shared/server/sessao';

export async function buscarDadosTiposKitAmostra(
    filtros: RequestGetTiposKit
): Promise<ResponseGetTiposKit> {
    const { token, perfilAtivo } = await obterSessao();
    return servicoGetTiposKitAmostra(token, String(perfilAtivo), filtros);
}
