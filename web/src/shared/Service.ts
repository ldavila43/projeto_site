export type ApiError = {
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

export async function fetchAutenticado<T>(
    metodo: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    rota: string,
    token: string,
    perfilAtivo?: string | null,
    payload?: object
): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const url = new URL(rota, baseUrl);

    console.log(perfilAtivo);
    
    const config: RequestInit = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(perfilAtivo ? { 'x-perfil-ativo': perfilAtivo } : {})
        }
    };

    if (payload) {
        if (metodo === 'GET' || metodo === 'DELETE') {
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.append(key, String(value));
                }
            });
        } else {
            config.body = JSON.stringify(removerNulos(payload));
            console.log(removerNulos(payload));
        }
    }

    const response = await fetch(url.toString(), config);

    let result: T | ApiError;
    try {
        const text = await response.text();
        result = text ? JSON.parse(text) : {} as T;
        console.log(JSON.stringify(result, null, 2));
    } catch {
        throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
        const erro = result as ApiError;
        throw new Error(
            erro.error?.message ?? 'Erro desconhecido ao comunicar com a API'
        );
    }

    return result as T;
}

function removerNulos<T>(obj: T): T {
    if (obj instanceof Date) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(removerNulos) as T;
    }

    if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([, value]) => value !== null && value !== undefined)
                .map(([key, value]) => [key, removerNulos(value)])
        ) as T;
    }

    return obj;
}