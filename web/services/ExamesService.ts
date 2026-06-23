import { fetchAutenticado } from '@/services/Service'
import { ExamesDTO, FiltrosBuscaExame } from '@/models/ExamesDTO'


export async function servicoExamesPaciente(
    token: string,
    filtros: FiltrosBuscaExame,
    perfilAtivo: string,
): Promise<ExamesDTO>{
    console.log('servico paciente: ' + perfilAtivo)
    return fetchAutenticado(
        '/exames/dados',
        token,
        perfilAtivo,
        filtros
    )
}


export async function servicoExamesProfissional(
    token: string,
    filtros: FiltrosBuscaExame,
    perfilAtivo: string
): Promise<ExamesDTO>{
    console.log('servico profissional: ' + perfilAtivo)
    return fetchAutenticado(
        '/exames/dados',
        token,
        perfilAtivo,
        filtros
    )
}


export async function servicoExamesAdmin(
    token: string,
    filtros: FiltrosBuscaExame,
    perfilAtivo: string,
): Promise<ExamesDTO>{
    console.log('servico admin: ' + perfilAtivo)
    return fetchAutenticado(
        '/exames/dados',
        token,
        perfilAtivo,
        filtros
    )
}
