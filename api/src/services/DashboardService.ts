import { buscaEstatisticasDashboard, bucaExamesDash } from '../repositories/PacientesRepository'
import { DashPacientesDTO } from '../models/DashPacientesDTO'

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