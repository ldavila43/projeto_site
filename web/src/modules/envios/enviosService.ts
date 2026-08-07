import { fetchAutenticado } from '@/src/shared/Service';
import {
    RequestGetEnvios,
    RequestPatchEnvio,
    RequestPostEnvio,
    ResponseGetEnvios,
    RespostaComandoEnvio
} from './enviosDTO';

export function servicoGetEnvios(
    token: string,
    perfilAtivo: string,
    filtros: RequestGetEnvios
): Promise<ResponseGetEnvios> {
    return fetchAutenticado(
        'GET',
        '/envios-kits/dados',
        token,
        perfilAtivo,
        filtros
    );
}

export function servicoPostEnvio(
    token: string,
    perfilAtivo: string,
    dados: RequestPostEnvio
): Promise<RespostaComandoEnvio> {
    return fetchAutenticado(
        'POST',
        '/envios-kits/cadastro',
        token,
        perfilAtivo,
        dados
    );
}

export function servicoDeleteEnvio(
    token: string,
    perfilAtivo: string,
    idEnvio: number
): Promise<RespostaComandoEnvio> {
    return fetchAutenticado(
        'DELETE',
        `/envios-kits/${idEnvio}`,
        token,
        perfilAtivo
    );
}

export function servicoPatchEnvio(
    token: string,
    perfilAtivo: string,
    idEnvio: number,
    dados: RequestPatchEnvio
): Promise<RespostaComandoEnvio> {
    return fetchAutenticado(
        'PATCH',
        `/envios-kits/${idEnvio}`,
        token,
        perfilAtivo,
        dados
    );
}
