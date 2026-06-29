import { fetchAutenticado } from '@/src/shared/Service'
import { ResponseGetKits, RequestGetKits } from './KitsAmostraDTO';

export async function servicoGetKits(
    token: string,
    perfilAtivo: string,
    filtros: RequestGetKits
): Promise<ResponseGetKits>{
    return fetchAutenticado(
        '/kits/dados',
        token,
        perfilAtivo,
        filtros
    )
}
