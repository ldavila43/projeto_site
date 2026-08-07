'use server'

import {
    servicoCardsLaboratorio,
    servicoDashboard,
    servicoDashboardAdmin,
    servicoDashboardProfissional,
    servicoGraficoLaboratorio,
    servicoSolicitacoesDashboardAdmin
} from './DashService';
import { DashPacientesDTO } from './ViewPacienteDTO';
import { DashAdminDTO } from './ViewAdminDTO';
import { DashProfissionaisDTO } from './ViewProfissionaisDTO';
import {
    CardsResumoLaboratorio,
    FiltrosGraficoLaboratorio,
    GraficoExamesLaboratorio
} from './ViewColaboradorDTO';
import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

export async function buscarDadosPacientes(): Promise<DashPacientesDTO> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.PACIENTE]
    });
    return servicoDashboard(token, String(perfilAtivo));
}

export async function buscarDadosProfissionais(
    idPaciente?: string,
    dataIni?: string,
    dataFim?: string
): Promise<DashProfissionaisDTO> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.PROFISSIONAL]
    });
    return servicoDashboardProfissional(
        token,
        String(perfilAtivo),
        idPaciente,
        dataIni,
        dataFim
    );
}

export async function buscarDadosAdmin(ano?: string): Promise<DashAdminDTO> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR]
    });
    return servicoDashboardAdmin(token, String(perfilAtivo), ano);
}

export async function buscarSolicitacoesAdmin(ano?: string): Promise<DashAdminDTO> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR]
    });
    return servicoSolicitacoesDashboardAdmin(token, String(perfilAtivo), ano);
}

export async function buscarCardsLaboratorio(): Promise<CardsResumoLaboratorio> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });
    return servicoCardsLaboratorio(token, String(perfilAtivo));
}

export async function buscarGraficoLaboratorio(
    filtros: FiltrosGraficoLaboratorio
): Promise<GraficoExamesLaboratorio> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });
    return servicoGraficoLaboratorio(token, String(perfilAtivo), filtros);
}
