'use server'

import { servicoGetPacientes, servicoPostPaciente } from './PacientesService';
import { FiltrosBuscaPaciente, PacienteResponse, RequestPostPaciente } from './PacientesDTO';
import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

export async function buscarDadosPacientes(
    filtros: FiltrosBuscaPaciente
): Promise<PacienteResponse> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR, PERFIS.PROFISSIONAL]
    });
    return servicoGetPacientes(token, String(perfilAtivo), filtros);
}

export async function cadastrarPaciente(dados: RequestPostPaciente): Promise<string> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });
    const resposta = await servicoPostPaciente(token, String(perfilAtivo), dados);
    return resposta.message;
}
