'use server'
import { cookies } from 'next/headers';
import { DashPacientesDTO } from '@/DTO/ViewPacienteDTO';
import { DashAdminDTO } from '@/DTO/ViewAdminDTO';
import { DashProfissionaisDTO } from '@/DTO/ViewProfissionaisDTO'
import { servicoDashboard, servicoDashboardProfissional, servicoDashboardAdmin } from '@/services/DashService';

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