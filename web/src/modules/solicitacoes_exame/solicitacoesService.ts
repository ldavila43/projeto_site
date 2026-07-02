import { fetchAutenticado } from '@/src/shared/Service'
import { RequestPostSolicitacaoDTO, RequestSolicitacoesDTO, GetSolicitacoesResponse } from './SolicitacaoDTO';


export async function servicoBuscaExames(
    token: string,
    perfilAtivo: string,
    filtros: RequestSolicitacoesDTO
): Promise<GetSolicitacoesResponse>{
    return fetchAutenticado(
        "GET",
        '/solicitacoes/dados',
        token,
        perfilAtivo,
        filtros
    )
}

export async function criarSolicitacao(
    token: string,
    perfilAtivo: string,
    filtros: RequestPostSolicitacaoDTO
): Promise<string>{
    return fetchAutenticado(
        "PUT",
        '/solicitacoes/dados',
        token,
        perfilAtivo,
        filtros
    )
}