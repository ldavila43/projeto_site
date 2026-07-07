import { fetchAutenticado } from '@/src/shared/Service'
import { RequestGetTiposKit, ResponseGetTiposKit } from './TiposKitAmostraDTO';

export async function servicoGetTiposKitAmostra(
    token: string,
    perfilAtivo: string,
    filtros: RequestGetTiposKit
): Promise<ResponseGetTiposKit>{
    return fetchAutenticado(
        "GET",
        '/tipos-kit/dados',
        token,
        perfilAtivo,
        filtros
    )
}