'use server'
import { cookies } from 'next/headers';
import { DashPacientesDTO } from '@/src/modules/dashboard/ViewPacienteDTO';
import { DashAdminDTO } from '@/src/modules/dashboard/ViewAdminDTO';
import { DashProfissionaisDTO } from '@/src/modules/dashboard/ViewProfissionaisDTO'
import { servicoDashboard, servicoDashboardProfissional, servicoDashboardAdmin, servicoSolicitacoesDashboardAdmin } from '@/src/modules/dashboard/DashService';

export async function buscarDadosPacientes(): Promise<DashPacientesDTO> {
    const cookieStore = await cookies();

    const token = cookieStore.get('session')?.value;
    if (!token) {
        throw new Error(
            "Sem token válido"
        )
    }
    try {
        const dadosDash: DashPacientesDTO = await servicoDashboard(token);

        return dadosDash;
    } catch (erro) {
            if (erro instanceof Error) {
                throw new Error(erro.message);
            }
            throw new Error("Erro desconhecido ao buscar dados");
        }

}


export async function buscarDadosProfissionais(idPaciente?: string, dataIni?: string, dataFim?: string): Promise<DashProfissionaisDTO> {
    const cookieStore = await cookies();

    const token = cookieStore.get('session')?.value;

    if (!token) {
        throw new Error(
            "Sem token válido"
        )
    }
    try {
        const dadosDash: DashProfissionaisDTO = await servicoDashboardProfissional(token, idPaciente, dataIni, dataFim);

        return dadosDash;
    } catch (erro) {
        if (erro instanceof Error) {
            throw new Error(erro.message);
        }
        throw new Error("Erro desconhecido ao buscar dados");
    }
}

export async function buscarDadosAdmin(ano?: string): Promise<DashAdminDTO> {
    const cookieStore = await cookies();

    const token = cookieStore.get('session')?.value;

    if (!token) {
        throw new Error(
            'Sem token válido'
        );
    }

    try {
        const dadosDash: DashAdminDTO = await servicoDashboardAdmin(token, ano);

        return dadosDash;
    } catch(erro) {
        if (erro instanceof Error) {
            throw new Error(erro.message);
        }
        throw new Error("Erro desconhecido ao buscar dados");
    }
}

export async function buscarSolicitacoesAdmin(ano?: string): Promise<DashAdminDTO> {
    const cookieStore = await cookies();

    const token = cookieStore.get('session')?.value;

    if (!token) {
        throw new Error(
            'Sem token válido'
        );
    }

    try {
        const dadosDash: DashAdminDTO = await servicoSolicitacoesDashboardAdmin(token, ano);

        return dadosDash;
    } catch(erro) {
        if (erro instanceof Error) {
            throw new Error(erro.message);
        }
        throw new Error("Erro desconhecido ao buscar dados");
    }
}