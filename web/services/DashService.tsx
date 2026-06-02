import { DashPacientesDTO } from '@/DTO/ViewPacienteDTO'
import { DashProfissionaisDTO } from '@/DTO/ViewProfissionaisDTO'
import { DashAdminDTO } from '@/DTO/ViewAdminDTO'

async function fetchAutenticado<T>(rota: string, token: string, params? :Record<string, string | undefined>): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const url = new URL(rota, baseUrl);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.append(key, value);
            }
        });
    }
    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    let result = null;
    try {
        result = await response.json();
    } catch (erro) {
        throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
        throw new Error(result?.error || 'Erro desconhecido');
    }

    return result as T;
}

export async function servicoDashboard(token: string): Promise<DashPacientesDTO> {
    return fetchAutenticado<DashPacientesDTO>('/dashboard/dados/pacientes/meus-dados', token);
}

export async function servicoDashboardProfissional(
    token: string,
    idPaciente?: string,
    dataIni?: string,
    dataFim?: string
): Promise<DashProfissionaisDTO> {
    return fetchAutenticado<DashProfissionaisDTO>(
        '/dashboard/dados/profissionais/meus-dados',
        token,
        { idPaciente, dataIni, dataFim }
    );
}

export async function servicoDashboardAdmin(
    token: string,
    ano?: string
): Promise<DashAdminDTO> {
    return fetchAutenticado<DashAdminDTO>(
        '/dashboard/dados/admin',
        token,
        { ano }
    );
}