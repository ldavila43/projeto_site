import { fetchAutenticado } from '@/src/shared/Service'
import { ResponseGetKits, RequestGetKits, RequestPostKitAmostra } from './KitsAmostraDTO';

export async function servicoGetKits(
    token: string,
    perfilAtivo: string,
    filtros: RequestGetKits
): Promise<ResponseGetKits>{
    return fetchAutenticado(
        "GET",
        '/kits/dados',
        token,
        perfilAtivo,
        filtros
    )
}

export async function servicoPostKit(
    token: string,
    perfilAtivo: string,
    dados: RequestPostKitAmostra
): Promise<void> {
    console.log(dados)
    return fetchAutenticado(
        "POST",
        '/kits/cadastro',
        token,
        perfilAtivo,
        dados
    );
}
