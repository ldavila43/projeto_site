import { fetchAutenticado } from '@/src/shared/Service'
import { FiltrosBuscaProfissional, ProfissionaisResponse } from './profissionaisDTO';


export async function servicoProfissionais(
    token: string,
    perfilAtivo: string,
    filtros: FiltrosBuscaProfissional
): Promise<ProfissionaisResponse>{
    return fetchAutenticado(
        '/profissionais-saude/dados',
        token,
        perfilAtivo,
        filtros
    )
}
