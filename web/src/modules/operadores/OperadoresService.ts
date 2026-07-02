import { fetchAutenticado } from '@/src/shared/Service'
import { OperadoresResponse, FiltroBuscaOperadores, ResponseRotasPerfil, ResponseGetPerfis } from './operadoresDTO';

export async function servicoGetOperadores(
    token: string,
    perfilAtivo: string,
    filtros: FiltroBuscaOperadores
): Promise<OperadoresResponse>{
    return fetchAutenticado(
        "GET",
        '/operadores/dados',
        token,
        perfilAtivo,
        filtros
    )
}

export async function servicoGetRotas(
    token: string,
    perfilAtivo: string
): Promise<ResponseRotasPerfil> {
    return fetchAutenticado(
        "GET",
        'operadores/rotas',
        token,
        perfilAtivo
    )
}

export async function servicoGetPerfis(
    token: string
): Promise<ResponseGetPerfis> {
    return fetchAutenticado(
        "GET",
        'operadores/perfis',
        token
    )
}