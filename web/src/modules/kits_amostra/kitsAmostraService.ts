import { fetchAutenticado } from '@/src/shared/Service'
import {
    ResponseGetKits,
    RequestGetKits,
    RequestPatchKitAmostra,
    RequestPostKitAmostra,
    RespostaAtualizacaoKit
} from './KitsAmostraDTO';

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
): Promise<RespostaAtualizacaoKit> {
    return fetchAutenticado(
        "POST",
        '/kits/cadastro',
        token,
        perfilAtivo,
        dados
    );
}

export async function servicoPatchKit(
    token: string,
    perfilAtivo: string,
    idKit: number,
    dados: RequestPatchKitAmostra
): Promise<RespostaAtualizacaoKit> {
    return fetchAutenticado(
        'PATCH',
        `/kits/${idKit}`,
        token,
        perfilAtivo,
        dados
    );
}

export async function servicoDeleteKit(
    token: string,
    perfilAtivo: string,
    idKit: number,
    forcar: boolean
): Promise<RespostaAtualizacaoKit> {
    const query = new URLSearchParams({
        forcar: forcar ? 'true' : 'false'
    });

    return fetchAutenticado(
        'DELETE',
        `/kits/${idKit}?${query.toString()}`,
        token,
        perfilAtivo
    );
}
