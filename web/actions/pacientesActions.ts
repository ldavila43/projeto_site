'use server'
import { cookies } from 'next/headers';
import {servicoPacientesProfissional, servicoPacientesAdmin} from '@/services/PacientesService';
import { PacienteDTO, FiltrosBuscaPaciente, PacienteResponse } from '@/models/PacientesDTO';

export async function executarComSessao<T>(
    funcaoServico: (
        token: string,
        filtros: FiltrosBuscaPaciente
    ) => Promise<T>,
    filtros: FiltrosBuscaPaciente
): Promise<T> {
    const cookieStore = await cookies();

    const token = cookieStore.get('session')?.value;

    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, filtros);
};

export async function buscarDadosPacientesProfissional(
    filtros: FiltrosBuscaPaciente
): Promise<PacienteResponse> {
    return executarComSessao(servicoPacientesProfissional, filtros);
}

export async function buscarDadosPacientesAdmin(
    filtros: FiltrosBuscaPaciente
): Promise<PacienteResponse> {
    return executarComSessao(servicoPacientesAdmin, filtros);
}
