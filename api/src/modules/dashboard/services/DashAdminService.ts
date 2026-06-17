import { buscaOperadoresAtivos, buscaSolicitacoesPorMes } from '../Repositories/AdminRepository';
import { DashAdminDTO } from '../DTO/DashAdminDTO';
import { buscaAnos } from '../Repositories/PacientesRepository';


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

export async function servicoSolicitacoesDashAdmin (ano: string | undefined): Promise<DashAdminDTO> {
    const solicitacoesPeriodo = await buscaSolicitacoesPorMes(ano);

    const resultado: DashAdminDTO = {
        solicitacoesPeriodo: solicitacoesPeriodo
    };

    return resultado;
}