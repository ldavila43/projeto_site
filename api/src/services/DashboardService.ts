import { buscaEstatisticasDashboard, bucaExamesDash } from '../repositories/PacientesRepository'
import { DashPacientesDTO } from '../models/DashPacientesDTO'
import { DashProfissionalDTO } from '../models/DashProfisisonalDTO';
import { DashAdminDTO } from '../models/DashAdminDTO';
import { buscaEstatisticasDashboardProf, bucaExamesDashProf } from '../repositories/ProfissionaisRepository';
import { buscaOperadoresAtivos, buscaSolicitacoesPorMes } from '../repositories/AdminRepository'
import { buscaAnos } from '../repositories/SolicitacaoExamesRepository'

export async function servicoDadosDashPaciente(dados: string): Promise<DashPacientesDTO> {

    const[estatisticas, exames] = await Promise.all([
        buscaEstatisticasDashboard(dados),
        bucaExamesDash(dados)
    ]);

    const resultado: DashPacientesDTO = {
        estatisticas: estatisticas,
        exames: exames
    };

    return resultado;
}

export async function servicoDadosDashProfissional(idProfissional: string, idPaciente?: string, dataIni?: Date, dataFim?: Date): Promise<DashProfissionalDTO> {

    const[estatisticas, exames] = await Promise.all([
        buscaEstatisticasDashboardProf(idProfissional),
        bucaExamesDashProf(idProfissional, idPaciente, dataIni, dataFim)
    ]);

    const resultado: DashProfissionalDTO ={
        estatisticas: estatisticas,
        exames: exames
    };

    return resultado;
}

export async function servicoDadosDashAdmin(ano: string | undefined): Promise<DashAdminDTO> {
    const[estatisticas, solicitacoesPeriodo, anos] = await Promise.all([
        buscaOperadoresAtivos(),
        buscaSolicitacoesPorMes(ano),
        buscaAnos()
    ]);

    const resultado: DashAdminDTO = {
        estatisticas: estatisticas,
        solicitacoesPeriodo: solicitacoesPeriodo,
        anosDisponiveis: anos
    };

    return resultado;
}