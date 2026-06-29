'use server'
import { cookies } from 'next/headers';
import { criarSolicitacao, servicoBuscaExames } from './solicitacoesService';
import { RequestPostSolicitacaoDTO, RequestSolicitacoesDTO, GetSolicitacoesResponse } from './SolicitacaoDTO';


export async function executarComSessao<T, D>(
    funcaoServico: (
        token: string,
        perfilAtivo: string,
        dados: D
    ) => Promise<T>,
    dados: D
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? '';

    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, perfilAtivo, dados);
};

export async function criarSolicitacaoExame (
    filtros: RequestPostSolicitacaoDTO
): Promise<string> {
    return executarComSessao(criarSolicitacao, filtros);
};


export async function buscarDadosSolicitacoes (
    filtros: RequestSolicitacoesDTO
): Promise<GetSolicitacoesResponse> {
    return executarComSessao(servicoBuscaExames, filtros);
};