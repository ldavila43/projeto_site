import { CorpoErroApi, ErroApi } from './ErroApi';

export type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

function obterUrl(rota: string): URL {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL não configurada');
    }

    return new URL(rota.startsWith('/') ? rota : `/${rota}`, baseUrl);
}

function adicionarQuery(url: URL, payload: object): void {
    Object.entries(payload).forEach(([chave, valor]) => {
        if (valor === undefined || valor === null || valor === '') return;

        const valorSerializado = valor instanceof Date
            ? valor.toISOString()
            : String(valor);

        url.searchParams.set(chave, valorSerializado);
    });
}

function removerNulos<T>(valor: T): T {
    if (valor instanceof Date) return valor;
    if (Array.isArray(valor)) return valor.map(removerNulos) as T;

    if (valor !== null && typeof valor === 'object') {
        return Object.fromEntries(
            Object.entries(valor)
                .filter(([, item]) => item !== null && item !== undefined)
                .map(([chave, item]) => [chave, removerNulos(item)])
        ) as T;
    }

    return valor;
}

async function lerResposta<T>(response: Response): Promise<T> {
    const texto = await response.text();

    if (!texto) return undefined as T;

    try {
        return JSON.parse(texto) as T;
    } catch {
        throw new ErroApi(
            'Resposta inválida do servidor',
            'INVALID_API_RESPONSE',
            response.status
        );
    }
}

export async function fetchAutenticado<T>(
    metodo: MetodoHttp,
    rota: string,
    token: string,
    perfilAtivo?: string | null,
    payload?: object
): Promise<T> {
    const url = obterUrl(rota);
    const possuiBody = metodo !== 'GET' && metodo !== 'DELETE';

    if (payload && !possuiBody) {
        adicionarQuery(url, payload);
    }

    const response = await fetch(url, {
        method: metodo,
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(perfilAtivo ? { 'x-perfil-ativo': perfilAtivo } : {})
        },
        ...(payload && possuiBody
            ? { body: JSON.stringify(removerNulos(payload)) }
            : {})
    });

    const resultado = await lerResposta<T | CorpoErroApi>(response);

    if (!response.ok) {
        const erro = resultado as CorpoErroApi | undefined;
        throw new ErroApi(
            erro?.error?.message ?? 'Erro ao comunicar com a API',
            erro?.error?.code ?? 'API_ERROR',
            response.status,
            erro?.error?.details ?? []
        );
    }

    return resultado as T;
}
