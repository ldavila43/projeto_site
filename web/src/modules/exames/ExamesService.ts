import { fetchAutenticado } from '@/src/shared/Service'
import { ExamesResponseDTO, FiltrosBuscaExame } from '@/src/modules/exames/ExamesDTO'


export async function servicoExames(
    token: string,
    filtros: FiltrosBuscaExame,
    perfilAtivo: string,
): Promise<ExamesResponseDTO>{
    return fetchAutenticado(
        "GET",
        '/exames/dados',
        token,
        perfilAtivo,
        filtros
    )
}