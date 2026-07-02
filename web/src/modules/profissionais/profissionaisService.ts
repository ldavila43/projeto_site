import { fetchAutenticado } from '@/src/shared/Service'
import { FiltrosBuscaProfissional, ProfissionaisResponse } from './profissionaisDTO';


export async function servicoGetProfissionais(
    token: string,
    perfilAtivo: string,
    filtros: FiltrosBuscaProfissional
): Promise<ProfissionaisResponse>{
    return fetchAutenticado(
        "GET",
        '/profissionais-saude/dados',
        token,
        perfilAtivo,
        filtros
    )
}
