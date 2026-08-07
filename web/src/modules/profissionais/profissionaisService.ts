import { fetchAutenticado } from '@/src/shared/Service'
import { FiltrosBuscaProfissional, ProfissionaisResponse, RequestPostProfissional } from './profissionaisDTO';

interface RespostaCadastroProfissional {
    message: string;
}


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

export async function servicoPostProfissional(
    token: string,
    perfilAtivo: string,
    dados: RequestPostProfissional
): Promise<RespostaCadastroProfissional> {
    return fetchAutenticado(
        'POST',
        '/profissionais-saude/cadastro',
        token,
        perfilAtivo,
        dados
    );
}
