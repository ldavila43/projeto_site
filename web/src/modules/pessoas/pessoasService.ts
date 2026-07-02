import { fetchAutenticado } from '@/src/shared/Service'
import { ResponsePessoaDTO, PessoaDTO } from './pessoasDTO';


export async function servicoGetPessoas(
    token: string,
    perfilAtivo: string,
    filtros?: { idPessoa?: string }
): Promise<ResponsePessoaDTO>{
    return fetchAutenticado(
        "GET",
        `/pessoas/${filtros?.idPessoa}`,
        token,
        perfilAtivo
    );
}

export async function servicoPatchPesosas(
    token: string,
    perfilAtivo: string,
    dados?: Partial<PessoaDTO>
): Promise<string> {
    return fetchAutenticado(
        'PATCH',
        `/pessoas/${dados?.idPessoa}`,
        token,
        perfilAtivo,
        dados
    )
}

export async function servicoGetMeusDados(
    token: string
): Promise<ResponsePessoaDTO> {
    return fetchAutenticado(
        "GET",
        '/pessoas/meus-dados',
        token
    )
}

export async function servicoPatchMeusDados(
    token: string,
    perfilAtivo: string,
    dados?: Partial<PessoaDTO>
): Promise<string> {
    return fetchAutenticado(
        "PATCH",
        '/pessoas/meus-dados',
        token,
        undefined,
        dados
    );
}
