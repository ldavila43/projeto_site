'use server'

import {
    criarAmostraNaSolicitacao,
    criarSolicitacao,
    servicoBuscarOpcoesAmostraSolicitacao,
    servicoBuscaExames,
    vincularKitNaSolicitacao
} from './solicitacoesService';
import {
    DetalhesConflitoAmostraGenetica,
    RequestPostAmostraSolicitacaoDTO,
    RequestPostSolicitacaoDTO,
    RequestSolicitacoesDTO,
    GetSolicitacoesResponse,
    ResponseOpcoesAmostraSolicitacao,
    ResultadoCadastroSolicitacao,
    ResultadoAcaoSolicitacao
} from './SolicitacaoDTO';
import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import { ErroApi } from '@/src/shared/ErroApi';

function obterConflitoAmostraGenetica(
    erro: ErroApi
): DetalhesConflitoAmostraGenetica | null {
    if (
        erro.codigo !== 'AMOSTRA_GENETICA_EXISTENTE'
        || Array.isArray(erro.detalhes)
        || typeof erro.detalhes !== 'object'
        || erro.detalhes === null
        || !Array.isArray(erro.detalhes.amostras)
        || typeof erro.detalhes.tipoAmostra !== 'object'
        || erro.detalhes.tipoAmostra === null
    ) {
        return null;
    }

    return erro.detalhes as unknown as DetalhesConflitoAmostraGenetica;
}

export async function criarSolicitacaoExame(
    dados: RequestPostSolicitacaoDTO
): Promise<ResultadoCadastroSolicitacao> {
    if (!dados.idPaciente) {
        throw new Error('Selecione o paciente.');
    }
    if (dados.idsTiposExames.length === 0) {
        throw new Error('Selecione ao menos um exame.');
    }
    if (!Number.isInteger(dados.quantidadeKits) || dados.quantidadeKits < 0) {
        throw new Error('A quantidade de kits deve ser um inteiro não negativo.');
    }

    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });

    const dadosNormalizados: RequestPostSolicitacaoDTO = {
        ...dados,
        idProfissional: dados.idProfissional || undefined,
        dataSolicitacao: dados.dataSolicitacao || undefined,
        statusSolicitacao: perfilAtivo === PERFIS.ADMINISTRADOR
            ? dados.statusSolicitacao
            : undefined,
        protocolo: dados.protocolo?.trim() || undefined,
        idKits: dados.idKits?.length ? dados.idKits : undefined
    };

    try {
        const resposta = await criarSolicitacao(
            token,
            String(perfilAtivo),
            dadosNormalizados
        );
        return {
            sucesso: true,
            mensagem: resposta.message
        };
    } catch (erro) {
        console.log(erro)
        if (erro instanceof ErroApi) {
            const conflito = obterConflitoAmostraGenetica(erro);
            if (conflito) {
                return {
                    sucesso: false,
                    tipo: 'CONFLITO_AMOSTRA_GENETICA',
                    conflito
                };
            }

            return {
                sucesso: false,
                tipo: 'ERRO_API',
                codigo: erro.codigo,
                mensagem: erro.message
            };
        }
        throw erro;
    }
}

export async function buscarDadosSolicitacoes(
    filtros: RequestSolicitacoesDTO
): Promise<GetSolicitacoesResponse> {
    const { token, perfilAtivo } = await obterSessao();
    return servicoBuscaExames(token, String(perfilAtivo), filtros);
}

export async function vincularKitSolicitacao(
    idSolicitacao: number,
    idKit: number
): Promise<ResultadoAcaoSolicitacao> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });

    try {
        const resposta = await vincularKitNaSolicitacao(
            token,
            String(perfilAtivo),
            idSolicitacao,
            idKit
        );
        return {
            sucesso: true,
            mensagem: resposta.message
        };
    } catch (erro) {
        if (erro instanceof ErroApi) {
            return {
                sucesso: false,
                codigo: erro.codigo,
                mensagem: erro.message
            };
        }
        throw erro;
    }
}

export async function criarAmostraSolicitacao(
    idSolicitacao: number,
    dados: RequestPostAmostraSolicitacaoDTO
): Promise<ResultadoAcaoSolicitacao> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });

    try {
        const resposta = await criarAmostraNaSolicitacao(
            token,
            String(perfilAtivo),
            idSolicitacao,
            dados
        );
        return {
            sucesso: true,
            mensagem: resposta.message
        };
    } catch (erro) {
        if (erro instanceof ErroApi) {
            return {
                sucesso: false,
                codigo: erro.codigo,
                mensagem: erro.message
            };
        }
        throw erro;
    }
}

export async function buscarOpcoesAmostraSolicitacao(
    idSolicitacao: number
): Promise<ResponseOpcoesAmostraSolicitacao> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });
    return servicoBuscarOpcoesAmostraSolicitacao(
        token,
        String(perfilAtivo),
        idSolicitacao
    );
}
