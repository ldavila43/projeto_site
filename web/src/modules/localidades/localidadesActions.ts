'use server'

import { obterSessao } from '@/src/shared/server/sessao';
import {
    FiltrosEstados,
    FiltrosMunicipios,
    FiltrosPaises,
    ResponseEstados,
    ResponseMunicipios,
    ResponsePaises
} from './localidadesDTO';
import {
    servicoGetEstados,
    servicoGetMunicipios,
    servicoGetPaises
} from './localidadesService';

export async function buscarPaises(
    filtros: FiltrosPaises = {}
): Promise<ResponsePaises> {
    const { token } = await obterSessao({ exigirPerfil: false });
    return servicoGetPaises(token, filtros);
}

export async function buscarEstados(
    filtros: FiltrosEstados
): Promise<ResponseEstados> {
    const { token } = await obterSessao({ exigirPerfil: false });
    return servicoGetEstados(token, filtros);
}

export async function buscarMunicipios(
    filtros: FiltrosMunicipios
): Promise<ResponseMunicipios> {
    const { token } = await obterSessao({ exigirPerfil: false });
    return servicoGetMunicipios(token, filtros);
}
