'use server'

import {
    servicoDeleteKit,
    servicoGetKits,
    servicoPatchKit,
    servicoPostKit
} from './kitsAmostraService';
import {
    ResponseGetKits,
    RequestGetKits,
    RequestPatchKitAmostra,
    RequestPostKitAmostra,
    ResultadoExclusaoKit
} from './KitsAmostraDTO';
import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import { ErroApi } from '@/src/shared/ErroApi';

const PERFIS_KITS = [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] as const;

function permiteExclusaoForcada(erro: ErroApi): boolean {
    if (
        erro.codigo !== 'KIT_HAS_DEPENDENCIES'
        || Array.isArray(erro.detalhes)
    ) {
        return false;
    }

    const possuiAmostras = 'amostras' in erro.detalhes;
    return !possuiAmostras;
}

export async function buscarDadosKitsAmostra(
    filtros: RequestGetKits
): Promise<ResponseGetKits> {
    const { token, perfilAtivo } = await obterSessao({ perfisPermitidos: PERFIS_KITS });
    return servicoGetKits(token, String(perfilAtivo), filtros);
}

export async function cadastrarKitAmostra(dados: RequestPostKitAmostra): Promise<string> {
    const { token, perfilAtivo } = await obterSessao({ perfisPermitidos: PERFIS_KITS });
    const resposta = await servicoPostKit(token, String(perfilAtivo), dados);
    return resposta.message;
}

async function executarAtualizacaoKit(
    idKit: number,
    dados: RequestPatchKitAmostra
): Promise<string> {
    if (!Number.isInteger(idKit) || idKit <= 0) {
        throw new Error('Kit inválido');
    }
    if (!Object.values(dados).some((valor) => valor !== undefined && valor !== '')) {
        throw new Error('Informe ao menos um campo para atualização');
    }

    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: PERFIS_KITS
    });
    const resposta = await servicoPatchKit(
        token,
        String(perfilAtivo),
        idKit,
        dados
    );
    return resposta.message;
}

export async function atualizarKitAmostra(
    idKit: number,
    dados: RequestPatchKitAmostra
): Promise<string> {
    return executarAtualizacaoKit(idKit, dados);
}

export async function excluirKitAmostra(
    idKit: number,
    forcar = false
): Promise<ResultadoExclusaoKit> {
    if (!Number.isInteger(idKit) || idKit <= 0) {
        return {
            sucesso: false,
            mensagem: 'Kit inválido',
            permiteForcar: false
        };
    }

    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR]
    });
    const exclusaoForcada = forcar === true;

    try {
        const resposta = await servicoDeleteKit(
            token,
            String(perfilAtivo),
            idKit,
            exclusaoForcada
        );
        return {
            sucesso: true,
            mensagem: resposta.message
        };
    } catch (erro) {
        if (erro instanceof ErroApi) {
            return {
                sucesso: false,
                mensagem: erro.message,
                permiteForcar: permiteExclusaoForcada(erro)
            };
        }
        throw erro;
    }
}
