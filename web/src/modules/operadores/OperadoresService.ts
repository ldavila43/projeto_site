import { fetchAutenticado } from '@/src/shared/Service'
import { OperadoresResponse, FiltroBuscaOperadores } from './operadoresDTO';

export async function servicoOperadores(
    token: string,
    perfilAtivo: string,
    filtros: FiltroBuscaOperadores
): Promise<OperadoresResponse>{
    return fetchAutenticado(
        '/operadores/dados',
        token,
        perfilAtivo,
        filtros
    )
}
