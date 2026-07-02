import { fetchAutenticado } from '@/src/shared/Service'
import { PacienteResponse, FiltrosBuscaPaciente } from '@/src/modules/pacientes/PacientesDTO'

export async function servicoGetPacientes(
    token: string,
    perfilAtivo: string,
    filtros: FiltrosBuscaPaciente
): Promise<PacienteResponse>{
    return fetchAutenticado(
        "GET",
        '/pacientes/dados',
        token,
        perfilAtivo,
        filtros
    )
}
