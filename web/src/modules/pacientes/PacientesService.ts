import { fetchAutenticado } from '@/src/shared/Service'
import { PacienteResponse, FiltrosBuscaPaciente } from '@/src/modules/pacientes/PacientesDTO'

export async function servicoPacientes(
    token: string,
    perfilAtivo: string,
    filtros: FiltrosBuscaPaciente
): Promise<PacienteResponse>{
    console.log(token, perfilAtivo)
    return fetchAutenticado(
        '/pacientes/dados',
        token,
        perfilAtivo,
        filtros
    )
}
