'use server'

import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import {
    RequestGetTiposEnvio,
    RequestPatchTipoEnvio,
    RequestPostTipoEnvio,
    ResponseGetTiposEnvio
} from './tiposEnvioDTO';
import {
    servicoDeleteTipoEnvio,
    servicoGetTiposEnvio,
    servicoPatchTipoEnvio,
    servicoPostTipoEnvio
} from './tiposEnvioService';

const PERFIS_GESTAO = [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] as const;

export async function buscarTiposEnvio(
    filtros: RequestGetTiposEnvio
): Promise<ResponseGetTiposEnvio> {
    const { token, perfilAtivo } = await obterSessao();
    return servicoGetTiposEnvio(token, String(perfilAtivo), filtros);
}

export async function cadastrarTipoEnvio(
    dados: RequestPostTipoEnvio
): Promise<string> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: PERFIS_GESTAO
    });
    const resposta = await servicoPostTipoEnvio(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function atualizarTipoEnvio(
    idTipoEnvio: number,
    dados: RequestPatchTipoEnvio
): Promise<string> {
    if (!Number.isInteger(idTipoEnvio) || idTipoEnvio <= 0) {
        throw new Error('Tipo de envio inválido.');
    }

    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: PERFIS_GESTAO
    });
    const resposta = await servicoPatchTipoEnvio(
        token,
        String(perfilAtivo),
        idTipoEnvio,
        dados
    );
    return resposta.message;
}

export async function excluirTipoEnvio(idTipoEnvio: number): Promise<string> {
    if (!Number.isInteger(idTipoEnvio) || idTipoEnvio <= 0) {
        throw new Error('Tipo de envio inválido.');
    }

    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: PERFIS_GESTAO
    });
    const resposta = await servicoDeleteTipoEnvio(
        token,
        String(perfilAtivo),
        idTipoEnvio
    );
    return resposta.message;
}
