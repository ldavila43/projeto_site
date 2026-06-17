import { buscaEstatisticasDashboardProf, bucaExamesDashProf } from '../Repositories/ProfissionaisRepository';
import { DashProfissionalDTO } from '../DTO/DashProfisisonalDTO';

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