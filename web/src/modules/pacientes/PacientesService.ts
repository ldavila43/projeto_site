import { fetchAutenticado } from '@/src/shared/Service'
import { PacienteResponse, FiltrosBuscaPaciente, RequestPostPaciente } from '@/src/modules/pacientes/PacientesDTO'

interface RespostaCadastroPaciente {
    message: string;
}

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

export async function servicoPostPaciente(
    token: string,
    perfilAtivo: string,
    dados: RequestPostPaciente
): Promise<RespostaCadastroPaciente> {
    return fetchAutenticado(
        'POST',
        '/pacientes/cadastro',
        token,
        perfilAtivo,
        dados
    );
}
