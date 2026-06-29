export async function fetchAutenticado<T>(
    rota: string,
    token: string,
    perfilAtivo?: string | null,
    payload?: object,
    metodo: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET'
): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    let url = new URL(rota, baseUrl);

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
            config.body = JSON.stringify(payload);
        }
    }

    const response = await fetch(url.toString(), config);
    
    let result = null;
    try {
        const text = await response.text();
        result = text ? JSON.parse(text) : {};
    } catch (erro) {
        throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
        throw new Error(result?.error || 'Erro desconhecido ao comunicar com a API');
    }

    return result as T;
}