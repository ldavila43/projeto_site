import { fetchAutenticado } from '@/src/shared/Service'
import { ResponsePessoaDTO } from './pessoasDTO';


export async function servicoPessoas(
    token: string,
    perfilAtivo: string,
    filtros: { idPessoa?: string }
): Promise<ResponsePessoaDTO>{
    return fetchAutenticado(
        `/pessoas/${filtros.idPessoa}`, // ID direto na URL
        token,
        perfilAtivo
    );
}

export async function servicoMeusDados(
    token: string,
    perfilAtivo: string,
    filtros: object
): Promise<ResponsePessoaDTO>{
    return fetchAutenticado(
        '/pessoas/meus-dados',
        token,
        perfilAtivo,
        filtros
    )
}
