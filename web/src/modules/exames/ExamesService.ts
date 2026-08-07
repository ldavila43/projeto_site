import { fetchAutenticado } from '@/src/shared/Service'
import { ExamesResponseDTO, FiltrosBuscaExame, VisaoGeralExame } from '@/src/modules/exames/ExamesDTO'

interface VisaoGeralExameApi {
    composicaoDominio?: unknown;
    bacilotaBacteroidota?: unknown;
    topVias?: unknown;
    severidadePersistencia?: unknown;
}

function ehRegistro(valor: unknown): valor is Record<string, unknown> {
    return valor !== null && typeof valor === 'object' && !Array.isArray(valor);
}

function obterLista(valor: unknown): Record<string, unknown>[] {
    if (!Array.isArray(valor)) return [];
    return valor.filter(ehRegistro);
}

function obterNumero(valor: unknown): number | null {
    if (
        (typeof valor !== 'number' && typeof valor !== 'string')
        || (typeof valor === 'string' && valor.trim() === '')
    ) {
        return null;
    }

    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
}

function normalizarVisaoGeral(resposta: VisaoGeralExameApi): VisaoGeralExame {
    const composicaoRecebida = ehRegistro(resposta.composicaoDominio)
        ? resposta.composicaoDominio.abundanciasEspecie
        : resposta.composicaoDominio;

    const composicaoDominio = obterLista(composicaoRecebida).flatMap((item) => {
        const abundancia = obterNumero(item.abundancia);
        return typeof item.especie === 'string' && abundancia !== null
            ? [{ especie: item.especie, abundancia }]
            : [];
    });

    const topVias = obterLista(resposta.topVias).flatMap((item) => (
        typeof item.nomeVia === 'string'
        && (typeof item.abundancia === 'string' || typeof item.abundancia === 'number')
            ? [{ nomeVia: item.nomeVia, abundancia: item.abundancia }]
            : []
    ));

    const severidadePersistencia = obterLista(resposta.severidadePersistencia)
        .flatMap((item) => (
            typeof item.tipo === 'string'
            && (typeof item.abundancia === 'string' || typeof item.abundancia === 'number')
                ? [{ tipo: item.tipo, abundancia: item.abundancia }]
                : []
        ));

    let bacilotaBacteroidota: VisaoGeralExame['bacilotaBacteroidota'];
    if (ehRegistro(resposta.bacilotaBacteroidota)) {
        const razao = obterNumero(resposta.bacilotaBacteroidota.razao);
        const bacilota = obterNumero(resposta.bacilotaBacteroidota.bacilota);
        const bacteroidota = obterNumero(resposta.bacilotaBacteroidota.bacteroidota);

        if (razao !== null && bacilota !== null && bacteroidota !== null) {
            bacilotaBacteroidota = { razao, bacilota, bacteroidota };
        }
    }

    return {
        composicaoDominio,
        bacilotaBacteroidota,
        topVias,
        severidadePersistencia
    };
}

export async function servicoExames(
    token: string,
    perfilAtivo: string,
    filtros: FiltrosBuscaExame
): Promise<ExamesResponseDTO>{
    return fetchAutenticado(
        "GET",
        '/exames/dados',
        token,
        perfilAtivo,
        filtros
    )
}

export async function servicoVisaoGeralExame(
    token: string,
    perfilAtivo: string,
    idExame: number
): Promise<VisaoGeralExame> {
    const resposta = await fetchAutenticado<VisaoGeralExameApi>(
        'GET',
        `/exames/${idExame}/visao-geral`,
        token,
        perfilAtivo
    );

    return normalizarVisaoGeral(resposta);
}
