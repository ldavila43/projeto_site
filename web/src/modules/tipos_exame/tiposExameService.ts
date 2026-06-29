import { fetchAutenticado } from '@/src/shared/Service'
import { ResponseGetTiposExame, RequestGetTiposExame } from './TiposExameDTO';

export async function servicoTiposExame(
    token: string,
    perfilAtivo: string,
    filtros: RequestGetTiposExame
): Promise<ResponseGetTiposExame>{
    return fetchAutenticado(
        '/tipos-exame/dados',
        token,
        perfilAtivo,
        filtros
    )
}
