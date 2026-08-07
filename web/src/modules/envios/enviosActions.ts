'use server'

import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import {
    RequestGetEnvios,
    RequestPatchEnvio,
    RequestPostEnvio,
    ResponseGetEnvios
} from './enviosDTO';
import {
    servicoDeleteEnvio,
    servicoGetEnvios,
    servicoPatchEnvio,
    servicoPostEnvio
} from './enviosService';

const PERFIS_ENVIOS = [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] as const;

export async function buscarEnvios(
    filtros: RequestGetEnvios
): Promise<ResponseGetEnvios> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: PERFIS_ENVIOS
    });
    return servicoGetEnvios(token, String(perfilAtivo), filtros);
}

export async function cadastrarEnvio(dados: RequestPostEnvio): Promise<string> {
    if (dados.idKits.length === 0) {
        throw new Error('Selecione ao menos um kit para envio.');
    }

    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: PERFIS_ENVIOS
    });
    const resposta = await servicoPostEnvio(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function excluirEnvio(idEnvio: number): Promise<string> {
    if (!Number.isInteger(idEnvio) || idEnvio <= 0) {
        throw new Error('Envio inválido.');
    }

    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: PERFIS_ENVIOS
    });
    const resposta = await servicoDeleteEnvio(
        token,
        String(perfilAtivo),
        idEnvio
    );
    return resposta.message;
}

export async function atualizarEnvio(
    idEnvio: number,
    dados: RequestPatchEnvio
): Promise<string> {
    if (!Number.isInteger(idEnvio) || idEnvio <= 0) {
        throw new Error('Envio inválido.');
    }
    if (!Object.values(dados).some((valor) => valor !== undefined)) {
        throw new Error('Informe ao menos um campo para atualização.');
    }

    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: PERFIS_ENVIOS
    });
    const resposta = await servicoPatchEnvio(
        token,
        String(perfilAtivo),
        idEnvio,
        dados
    );
    return resposta.message;
}
