import { DashPacientesDTO } from '@/models/ViewPacienteDTO'
import { DashProfissionaisDTO } from '@/models/ViewProfissionaisDTO'
import { DashAdminDTO } from '@/models/ViewAdminDTO'
import { fetchAutenticado } from '@/services/Service'

export async function servicoDashboard(token: string): Promise<DashPacientesDTO> {
    return fetchAutenticado<DashPacientesDTO>('/dashboard/pacientes/meus-dados', token);
}

export async function servicoDashboardProfissional(
    token: string,
    idPaciente?: string,
    dataIni?: string,
    dataFim?: string
): Promise<DashProfissionaisDTO> {
    return fetchAutenticado<DashProfissionaisDTO>(
        '/dashboard/profissionais/meus-dados',
        token,
        { idPaciente, dataIni, dataFim }
    );
}

export async function servicoDashboardAdmin(
    token: string,
    ano?: string
): Promise<DashAdminDTO> {
    return fetchAutenticado<DashAdminDTO>(
        '/dashboard/admin',
        token,
        { ano }
    );
}

export async function servicoSolicitacoesDashboardAdmin(
    token: string,
    ano?: string
): Promise<DashAdminDTO> {
    return fetchAutenticado<DashAdminDTO>(
        '/dashboard/admin/solicitacoes',
        token,
        { ano }
    );
}