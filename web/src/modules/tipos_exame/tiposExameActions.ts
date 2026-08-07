'use server'

import { servicoGetTiposExame, servicoPostTipoExame } from './tiposExameService';
import { ResponseGetTiposExame, RequestGetTiposExame, RequestPostTipoExame } from './TiposExameDTO';
import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

export async function buscarDadosTiposExame(
    filtros: RequestGetTiposExame
): Promise<ResponseGetTiposExame> {
    const { token, perfilAtivo } = await obterSessao();
    return servicoGetTiposExame(token, String(perfilAtivo), filtros);
}

export async function criarTipoExame(dados: RequestPostTipoExame): Promise<void> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
    });
    await servicoPostTipoExame(token, String(perfilAtivo), dados);
}
