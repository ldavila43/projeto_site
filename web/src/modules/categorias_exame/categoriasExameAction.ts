'use server'

import { servicoGetCategorias } from './categoriasExameService';
import { FiltrosGetCategorias, ResponseGetCategorias } from './CategoriasExameDTO';
import { obterSessao } from '@/src/shared/server/sessao';

export async function buscarDadosCategoriasExames(
    filtros: FiltrosGetCategorias
): Promise<ResponseGetCategorias> {
    const { token, perfilAtivo } = await obterSessao();
    return servicoGetCategorias(token, filtros, String(perfilAtivo));
}
