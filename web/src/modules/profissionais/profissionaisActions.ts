'use server'

import { servicoGetProfissionais, servicoPostProfissional } from './profissionaisService';
import { FiltrosBuscaProfissional, ProfissionaisResponse, RequestPostProfissional } from './profissionaisDTO';
import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

export async function buscarDadosProfissionais(
    filtros: FiltrosBuscaProfissional
): Promise<ProfissionaisResponse> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });
    return servicoGetProfissionais(token, String(perfilAtivo), filtros);
}

export async function cadastrarProfissional(dados: RequestPostProfissional): Promise<string> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });
    const resposta = await servicoPostProfissional(token, String(perfilAtivo), dados);
    return resposta.message;
}
