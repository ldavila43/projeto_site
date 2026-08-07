import { fetchAutenticado } from '@/src/shared/Service';
import {
    FiltrosEstados,
    FiltrosMunicipios,
    FiltrosPaises,
    ResponseEstados,
    ResponseMunicipios,
    ResponsePaises
} from './localidadesDTO';

export function servicoGetPaises(
    token: string,
    filtros: FiltrosPaises
): Promise<ResponsePaises> {
    return fetchAutenticado('GET', '/localidades/paises', token, null, filtros);
}

export function servicoGetEstados(
    token: string,
    filtros: FiltrosEstados
): Promise<ResponseEstados> {
    return fetchAutenticado('GET', '/localidades/estados', token, null, filtros);
}

export function servicoGetMunicipios(
    token: string,
    filtros: FiltrosMunicipios
): Promise<ResponseMunicipios> {
    return fetchAutenticado('GET', '/localidades/municipios', token, null, filtros);
}
