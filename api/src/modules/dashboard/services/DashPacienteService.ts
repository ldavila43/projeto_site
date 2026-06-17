import { buscaEstatisticasDashboard, bucaExamesDash } from '../Repositories/PacientesRepository'
import { DashPacientesDTO } from '../DTO/DashPacientesDTO'


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