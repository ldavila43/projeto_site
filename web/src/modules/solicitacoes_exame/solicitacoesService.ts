import { fetchAutenticado } from '@/src/shared/Service'
import { RequestPostSolicitacaoDTO, RequestSolicitacoesDTO, GetSolicitacoesResponse } from './SolicitacaoDTO';


export async function servicoBuscaExames(
    token: string,
    perfilAtivo: string,
    filtros: RequestSolicitacoesDTO
): Promise<GetSolicitacoesResponse>{
    return fetchAutenticado(
        '/solicitacoes/dados',
        token,
        perfilAtivo,
        filtros
    )
}
export async function criarSolicitacao(token: string, perfilAtivo: string, dados: RequestPostSolicitacaoDTO): Promise<string>{
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const url = new URL('/solicitacoes/cadastro', baseUrl);
    const response = await fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...(perfilAtivo ? { 'x-perfil-ativo': perfilAtivo } : {})
            },
            body: JSON.stringify(dados)
        }
    );
    let result
    try {
        result = await response.json();
    } catch(erro) {
        throw new Error('Resposta inválida do servidor');
    }
    if (!response.ok) {
        throw new Error(
            typeof result === "string" ? result : result?.error || "Erro desconhecido"
        );
    }
    return result;
}