import { fetchAutenticado } from '@/src/shared/Service'
import { ResponseGetTiposExame, RequestGetTiposExame, RequestPostTipoExame } from './TiposExameDTO';

export async function servicoGetTiposExame(
    token: string,
    perfilAtivo: string,
    filtros: RequestGetTiposExame
): Promise<ResponseGetTiposExame>{
    return fetchAutenticado(
        '/tipos-exame/dados',
        token,
        perfilAtivo,
        filtros
    )
}

export async function servicoPostTipoExame(token: string, perfilAtivo: string, dados: RequestPostTipoExame): Promise<void>{
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const url = new URL('/tipos-exame/novo', baseUrl);
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