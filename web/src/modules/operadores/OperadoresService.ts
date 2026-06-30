import { fetchAutenticado } from '@/src/shared/Service'
import { OperadoresResponse, FiltroBuscaOperadores, ResponseRotasPerfil, ResponseGetPerfis } from './operadoresDTO';

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

export async function servicoRotas(
    token: string,
    perfilAtivo: string
): Promise<ResponseRotasPerfil> {
    return fetchAutenticado(
        'operadores/rotas',
        token,
        perfilAtivo
    )
}

export async function servicoPerfis(
    token: string
): Promise<ResponseGetPerfis> {
    return fetchAutenticado(
        'operadores/perfis',
        token
    )
}