

export async function fetchAutenticado<T>(
    rota: string,
    token: string,
    perfilAtivo?: string,
    params?: object
): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const url = new URL(rota, baseUrl);
    console.log('perfil ativo: ' + perfilAtivo);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.append(key, value);
            }
        });
    }
    let response;

    if(perfilAtivo != null){
        response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-perfil-ativo': perfilAtivo
            }
        });
    } else {
        response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
    }
    let result = null;
    try {
        result = await response.json();
        console.log(result)
    } catch (erro) {
        throw new Error('Resposta inválida do servidor');
    }

    if (!response.ok) {
        throw new Error(result?.error || 'Erro desconhecido');
    }

    return result as T;
}