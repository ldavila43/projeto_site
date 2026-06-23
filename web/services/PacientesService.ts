import { fetchAutenticado } from '@/services/Service'
import { PacienteResponse, FiltrosBuscaPaciente } from '@/models/PacientesDTO'

export async function servicoPacientesProfissional(
    token: string,
    filtros: FiltrosBuscaPaciente
): Promise<PacienteResponse>{
    return fetchAutenticado(
        '/pacientes/profissionais',
        token,
        filtros
    )
}


export async function servicoPacientesAdmin(
    token: string,
    filtros: FiltrosBuscaPaciente
): Promise<PacienteResponse>{
    return fetchAutenticado(
        '/pacientes/admin',
        token,
        filtros
    )
}
