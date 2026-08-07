import { DashPacientesDTO } from '@/src/modules/dashboard/ViewPacienteDTO'
import { DashProfissionaisDTO } from '@/src/modules/dashboard/ViewProfissionaisDTO'
import { DashAdminDTO } from '@/src/modules/dashboard/ViewAdminDTO'
import { fetchAutenticado } from '@/src/shared/Service'
import {
    CardsResumoLaboratorio,
    FiltrosGraficoLaboratorio,
    GraficoExamesLaboratorio
} from './ViewColaboradorDTO';

export async function servicoDashboard(token: string, perfilAtivo: string): Promise<DashPacientesDTO> {
    return fetchAutenticado<DashPacientesDTO>(
        "GET",
        '/dashboard/pacientes/meus-dados',
        token,
        perfilAtivo
    );
}

export async function servicoDashboardProfissional(
    token: string,
    perfilAtivo: string,
    idPaciente?: string,
    dataIni?: string,
    dataFim?: string
): Promise<DashProfissionaisDTO> {
    return fetchAutenticado<DashProfissionaisDTO>(
        "GET",
        '/dashboard/profissionais/meus-dados',
        token,
        perfilAtivo,
        { idPaciente, dataIni, dataFim }
    );
}

export async function servicoDashboardAdmin(
    token: string,
    perfilAtivo: string,
    ano?: string
): Promise<DashAdminDTO> {
    return fetchAutenticado<DashAdminDTO>(
        "GET",
        '/dashboard/admin',
        token,
        perfilAtivo,
        { ano }
    );
}

export async function servicoSolicitacoesDashboardAdmin(
    token: string,
    perfilAtivo: string,
    ano?: string
): Promise<DashAdminDTO> {
    return fetchAutenticado<DashAdminDTO>(
        "GET",
        '/dashboard/admin/solicitacoes',
        token,
        perfilAtivo,
        { ano }
    );
}

export async function servicoCardsLaboratorio(
    token: string,
    perfilAtivo: string
): Promise<CardsResumoLaboratorio> {
    return fetchAutenticado(
        'GET',
        '/dashboard/laboratorio/cards-resumo',
        token,
        perfilAtivo
    );
}

export async function servicoGraficoLaboratorio(
    token: string,
    perfilAtivo: string,
    filtros: FiltrosGraficoLaboratorio
): Promise<GraficoExamesLaboratorio> {
    const resposta = await fetchAutenticado<{
        TiposExame: Array<Omit<GraficoExamesLaboratorio['TiposExame'][number], 'contagem'> & {
            contagem?: number | string | null;
            count?: number | string | null;
        }>;
    }>(
        'GET',
        '/dashboard/laboratorio/grafico-exames',
        token,
        perfilAtivo,
        filtros
    );

    return {
        TiposExame: (resposta.TiposExame ?? []).map((tipo) => {
            const contagem = Number(tipo.contagem ?? tipo.count);

            return {
                idTipoExame: tipo.idTipoExame,
                nomeTipoExame: tipo.nomeTipoExame,
                contagem: Number.isFinite(contagem) && contagem >= 0
                    ? contagem
                    : 0
            };
        })
    };
}
