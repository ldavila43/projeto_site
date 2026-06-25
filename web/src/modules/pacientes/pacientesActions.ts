'use server'
import { cookies } from 'next/headers';
import { servicoPacientes } from '@/src/modules/pacientes/PacientesService';
import { PacienteDTO, FiltrosBuscaPaciente, PacienteResponse } from '@/src/modules/pacientes/PacientesDTO';

export async function executarComSessao<T>(
    funcaoServico: (
        token: string,
        perfilAtivo: string,
        filtros: FiltrosBuscaPaciente
    ) => Promise<T>,
    filtros: FiltrosBuscaPaciente
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? ''
    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, perfilAtivo, filtros);
};

export async function buscarDadosPacientes(
    filtros: FiltrosBuscaPaciente
): Promise<PacienteResponse> {
    return executarComSessao(servicoPacientes, filtros);
}
