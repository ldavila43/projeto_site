import { fetchAutenticado } from '@/src/shared/Service';
import {
    RequestGetTiposEnvio,
    RequestPatchTipoEnvio,
    RequestPostTipoEnvio,
    ResponseGetTiposEnvio,
    RespostaTipoEnvio
} from './tiposEnvioDTO';

export function servicoGetTiposEnvio(
    token: string,
    perfilAtivo: string,
    filtros: RequestGetTiposEnvio
): Promise<ResponseGetTiposEnvio> {
    return fetchAutenticado(
        'GET',
        '/tipos-envio/dados',
        token,
        perfilAtivo,
        filtros
    );
}

export function servicoPostTipoEnvio(
    token: string,
    perfilAtivo: string,
    dados: RequestPostTipoEnvio
): Promise<RespostaTipoEnvio> {
    return fetchAutenticado(
        'POST',
        '/tipos-envio/cadastro',
        token,
        perfilAtivo,
        dados
    );
}

export function servicoPatchTipoEnvio(
    token: string,
    perfilAtivo: string,
    idTipoEnvio: number,
    dados: RequestPatchTipoEnvio
): Promise<RespostaTipoEnvio> {
    return fetchAutenticado(
        'PATCH',
        `/tipos-envio/${idTipoEnvio}`,
        token,
        perfilAtivo,
        dados
    );
}

export function servicoDeleteTipoEnvio(
    token: string,
    perfilAtivo: string,
    idTipoEnvio: number
): Promise<RespostaTipoEnvio> {
    return fetchAutenticado(
        'DELETE',
        `/tipos-envio/${idTipoEnvio}`,
        token,
        perfilAtivo
    );
}
