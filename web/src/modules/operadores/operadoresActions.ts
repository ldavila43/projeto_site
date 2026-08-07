'use server'

import { servicoGetOperadores, servicoGetRotas, servicoGetPerfis } from './OperadoresService';
import {
    OperadoresResponse,
    FiltroBuscaOperadores,
    ResponseRotasPerfil,
    ResponseGetPerfis
} from './operadoresDTO';
import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

export async function buscarDadosOperadores(
    filtros: FiltroBuscaOperadores
): Promise<OperadoresResponse> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });
    return servicoGetOperadores(token, String(perfilAtivo), filtros);
}

export async function buscaRotasOperadores(): Promise<ResponseRotasPerfil> {
    const { token, perfilAtivo } = await obterSessao();
    return servicoGetRotas(token, String(perfilAtivo));
}

export async function buscaPerfisOperador(): Promise<ResponseGetPerfis> {
    const { token } = await obterSessao({ exigirPerfil: false });
    return servicoGetPerfis(token);
}
