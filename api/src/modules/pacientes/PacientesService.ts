import { buscaPacientesNome, buscaMetadadosPacientes } from './PacientesRepository';
import { PacientesMetadados, PacienteResponse, PacienteRequest } from './PacienteDTO'

export async function buscaPacientes(request: PacienteRequest): Promise<PacienteResponse> {
    const [total, pacientes] = await Promise.all(
        [buscaMetadadosPacientes(request.nome, request.idProfissional),
        buscaPacientesNome(request.nome, request.idProfissional, request.limit, request.offset)]
    )

    let limite;

    if (!request.limit){
        limite = 10;
    } else {
        limite = request.limit;
    }

    const totalRegistros = Number(total)
    const totalPaginas = Math.ceil(totalRegistros / limite);

    const metadados: PacientesMetadados = {
        totalRegistros: totalRegistros,
        totalPaginas: totalPaginas
    }
    const pacienteResponse: PacienteResponse = {
        metadados: metadados,
        pacientes: pacientes
    }

    return pacienteResponse;
}