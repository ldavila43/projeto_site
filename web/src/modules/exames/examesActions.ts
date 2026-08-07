'use server'

import { servicoExames, servicoVisaoGeralExame } from './ExamesService';
import { ExamesResponseDTO, FiltrosBuscaExame, VisaoGeralExame } from './ExamesDTO';
import { obterSessao } from '@/src/shared/server/sessao';

export async function buscarDadosExames(
    filtros: FiltrosBuscaExame
): Promise<ExamesResponseDTO> {
    const { token, perfilAtivo } = await obterSessao();
    return servicoExames(token, String(perfilAtivo), filtros);
}

export async function buscarVisaoGeralExame(idExame: number): Promise<VisaoGeralExame> {
    if (!Number.isInteger(idExame) || idExame <= 0) {
        throw new Error('Exame inválido');
    }
    const { token, perfilAtivo } = await obterSessao();
    return servicoVisaoGeralExame(token, String(perfilAtivo), idExame);
}
