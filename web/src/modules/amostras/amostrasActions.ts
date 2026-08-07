'use server'

import { obterSessao } from '@/src/shared/server/sessao';
import { FiltrosAmostras, ResponseAmostras } from './AmostrasDTO';
import { servicoGetAmostras } from './amostrasService';

export async function buscarAmostras(filtros: FiltrosAmostras): Promise<ResponseAmostras> {
    const { token, perfilAtivo } = await obterSessao();
    return servicoGetAmostras(token, String(perfilAtivo), filtros);
}
