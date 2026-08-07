import { fetchAutenticado } from '@/src/shared/Service'
import { normalizarListaTexto } from '@/src/shared/utils/normalizarListaTexto';
import {
    RequestPostSolicitacaoDTO,
    RequestSolicitacoesDTO,
    GetSolicitacoesResponse,
    SolicitacoesExame
} from './SolicitacaoDTO';

type CamposFluxoSolicitacao =
    | 'podeVincularKit'
    | 'podeCriarAmostra'
    | 'kitsVinculados'
    | 'amostrasVinculadas'
    | 'kitsPendentes'
    | 'amostrasPendentes';

type SolicitacaoApi = Omit<
    SolicitacoesExame,
    'tiposExame' | CamposFluxoSolicitacao
> & {
    tiposExame: string | null;
    [campo: string]: unknown;
};

function obterCampoFluxo(
    solicitacao: SolicitacaoApi,
    campo: CamposFluxoSolicitacao,
    campoSnakeCase: string
): unknown {
    // Compatibilidade exclusiva de transporte. A elegibilidade nunca deve ser
    // recalculada no frontend a partir das contagens ou do status dos kits.
    return solicitacao[campo]
        ?? solicitacao[campo.toLowerCase()]
        ?? solicitacao[campoSnakeCase];
}

function obterBooleanoFluxo(
    solicitacao: SolicitacaoApi,
    campo: Extract<CamposFluxoSolicitacao, `pode${string}`>,
    campoSnakeCase: string
): boolean {
    const valor = obterCampoFluxo(solicitacao, campo, campoSnakeCase);
    if (typeof valor !== 'boolean') {
        throw new Error(
            `Resposta inválida de /solicitacoes/dados: ${campo} não foi informado como booleano.`
        );
    }
    return valor;
}

function obterNumeroFluxo(
    solicitacao: SolicitacaoApi,
    campo: Exclude<CamposFluxoSolicitacao, `pode${string}`>,
    campoSnakeCase: string
): number {
    const valor = obterCampoFluxo(solicitacao, campo, campoSnakeCase);
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
        throw new Error(
            `Resposta inválida de /solicitacoes/dados: ${campo} não foi informado como número.`
        );
    }
    return valor;
}

export async function servicoBuscaExames(
    token: string,
    perfilAtivo: string,
    filtros: RequestSolicitacoesDTO
): Promise<GetSolicitacoesResponse>{
    const resposta = await fetchAutenticado<
        Omit<GetSolicitacoesResponse, 'solicitacoes'> & {
            solicitacoes: SolicitacaoApi[];
        }
    >(
        "GET",
        '/solicitacoes/dados',
        token,
        perfilAtivo,
        filtros
    );

    return {
        ...resposta,
        solicitacoes: resposta.solicitacoes.map((solicitacao) => ({
            ...solicitacao,
            tiposExame: normalizarListaTexto(solicitacao.tiposExame),
            podeVincularKit: obterBooleanoFluxo(
                solicitacao,
                'podeVincularKit',
                'pode_vincular_kit'
            ),
            podeCriarAmostra: obterBooleanoFluxo(
                solicitacao,
                'podeCriarAmostra',
                'pode_criar_amostra'
            ),
            kitsVinculados: obterNumeroFluxo(
                solicitacao,
                'kitsVinculados',
                'kits_vinculados'
            ),
            amostrasVinculadas: obterNumeroFluxo(
                solicitacao,
                'amostrasVinculadas',
                'amostras_vinculadas'
            ),
            kitsPendentes: obterNumeroFluxo(
                solicitacao,
                'kitsPendentes',
                'kits_pendentes'
            ),
            amostrasPendentes: obterNumeroFluxo(
                solicitacao,
                'amostrasPendentes',
                'amostras_pendentes'
            )
        }))
    };
}

export async function criarSolicitacao(
    token: string,
    perfilAtivo: string,
    dados: RequestPostSolicitacaoDTO
): Promise<{ message: string }>{
    return fetchAutenticado(
        "POST",
        '/solicitacoes/cadastro',
        token,
        perfilAtivo,
        dados
    )
}
