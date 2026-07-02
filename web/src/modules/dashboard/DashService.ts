import { DashPacientesDTO } from '@/src/modules/dashboard/ViewPacienteDTO'
import { DashProfissionaisDTO } from '@/src/modules/dashboard/ViewProfissionaisDTO'
import { DashAdminDTO } from '@/src/modules/dashboard/ViewAdminDTO'
import { fetchAutenticado } from '@/src/shared/Service'

export async function servicoDashboard(token: string): Promise<DashPacientesDTO> {
    return fetchAutenticado<DashPacientesDTO>("GET", '/dashboard/pacientes/meus-dados', token);
}

export async function servicoDashboardProfissional(
    token: string,
    idPaciente?: string,
    dataIni?: string,
    dataFim?: string
): Promise<DashProfissionaisDTO> {
    return fetchAutenticado<DashProfissionaisDTO>(
        "GET",
        '/dashboard/profissionais/meus-dados',
        token,
        undefined,
        { idPaciente, dataIni, dataFim }
    );
}

export async function servicoDashboardAdmin(
    token: string,
    ano?: string
): Promise<DashAdminDTO> {
    return fetchAutenticado<DashAdminDTO>(
        "GET",
        '/dashboard/admin',
        token,
        undefined,
        { ano }
    );
}

export async function servicoSolicitacoesDashboardAdmin(
    token: string,
    ano?: string
): Promise<DashAdminDTO> {
    return fetchAutenticado<DashAdminDTO>(
        "GET",
        '/dashboard/admin/solicitacoes',
        token,
        undefined,
        { ano }
    );
}