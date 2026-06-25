import { fetchAutenticado } from '@/src/shared/Service'
import { ExamesDTO, FiltrosBuscaExame } from '@/src/modules/exames/ExamesDTO'


export async function servicoExames(
    token: string,
    filtros: FiltrosBuscaExame,
    perfilAtivo: string,
): Promise<ExamesDTO>{
    return fetchAutenticado(
        '/exames/dados',
        token,
        perfilAtivo,
        filtros
    )
}