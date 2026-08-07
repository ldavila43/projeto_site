import { fetchAutenticado } from '@/src/shared/Service';
import {
    AtualizacaoEmailPessoa,
    AtualizacaoEnderecoPessoa,
    AtualizacaoTelefonePessoa,
    FiltrosBuscaPessoas,
    IdentificacaoEmailPessoa,
    IdentificacaoEnderecoPessoa,
    IdentificacaoTelefonePessoa,
    NovoEmailPessoa,
    NovoEnderecoPessoa,
    NovoTelefonePessoa,
    PapelPessoa,
    RequestPatchPessoa,
    RequestPostPessoa,
    RespostaMensagem,
    RespostaCadastroEmail,
    RespostaCadastroEndereco,
    RespostaCadastroTelefone,
    ResponseBuscaPessoas,
    ResponseEmailsPessoa,
    ResponsePessoaDTO,
    ResponseTelefonesPessoa
} from './pessoasDTO';
import { normalizarListaTexto } from '@/src/shared/utils/normalizarListaTexto';

type ResponseBuscaPessoasApi = Omit<ResponseBuscaPessoas, 'dados'> & {
    dados: Array<Omit<ResponseBuscaPessoas['dados'][number], 'papeis'> & {
        papeis: unknown;
    }>;
};

const PAPEIS_PESSOA = new Set<PapelPessoa>([
    'PACIENTE',
    'PROFISSIONAL_SAUDE',
    'FUNCIONARIO'
]);

function ehPapelPessoa(valor: string): valor is PapelPessoa {
    return PAPEIS_PESSOA.has(valor as PapelPessoa);
}

export async function servicoGetPessoas(
    token: string,
    perfilAtivo: string,
    filtros: FiltrosBuscaPessoas
): Promise<ResponseBuscaPessoas> {
    const resposta = await fetchAutenticado<ResponseBuscaPessoasApi>(
        'GET',
        '/pessoas/dados',
        token,
        perfilAtivo,
        filtros
    );

    return {
        ...resposta,
        dados: resposta.dados.map((pessoa) => ({
            ...pessoa,
            papeis: normalizarListaTexto(pessoa.papeis).filter(ehPapelPessoa)
        }))
    };
}

export async function servicoGetPessoa(
    token: string,
    perfilAtivo: string,
    idPessoa: string
): Promise<ResponsePessoaDTO> {
    return fetchAutenticado('GET', `/pessoas/${idPessoa}`, token, perfilAtivo);
}

export async function servicoGetEmailsPessoa(
    token: string,
    perfilAtivo: string,
    idPessoa: string
): Promise<ResponseEmailsPessoa> {
    return fetchAutenticado(
        'GET',
        `/pessoas/${idPessoa}/emails`,
        token,
        perfilAtivo
    );
}

export async function servicoGetTelefonesPessoa(
    token: string,
    perfilAtivo: string,
    idPessoa: string
): Promise<ResponseTelefonesPessoa> {
    return fetchAutenticado(
        'GET',
        `/pessoas/${idPessoa}/telefones`,
        token,
        perfilAtivo
    );
}

export function servicoPostEmailPessoa(
    token: string,
    perfilAtivo: string,
    dados: NovoEmailPessoa
): Promise<RespostaCadastroEmail> {
    const { idPessoa, ...body } = dados;
    return fetchAutenticado(
        'POST',
        `/pessoas/${idPessoa}/emails`,
        token,
        perfilAtivo,
        body
    );
}

export function servicoPatchEmailPessoa(
    token: string,
    perfilAtivo: string,
    dados: AtualizacaoEmailPessoa
): Promise<RespostaMensagem> {
    const { idPessoa, idEmail, ...body } = dados;
    return fetchAutenticado(
        'PATCH',
        `/pessoas/${idPessoa}/emails/${idEmail}`,
        token,
        perfilAtivo,
        body
    );
}

export function servicoDeleteEmailPessoa(
    token: string,
    perfilAtivo: string,
    dados: IdentificacaoEmailPessoa
): Promise<RespostaMensagem> {
    return fetchAutenticado(
        'DELETE',
        `/pessoas/${dados.idPessoa}/emails/${dados.idEmail}`,
        token,
        perfilAtivo
    );
}

export function servicoPostTelefonePessoa(
    token: string,
    perfilAtivo: string,
    dados: NovoTelefonePessoa
): Promise<RespostaCadastroTelefone> {
    const { idPessoa, ...body } = dados;
    return fetchAutenticado(
        'POST',
        `/pessoas/${idPessoa}/telefones`,
        token,
        perfilAtivo,
        body
    );
}

export function servicoPatchTelefonePessoa(
    token: string,
    perfilAtivo: string,
    dados: AtualizacaoTelefonePessoa
): Promise<RespostaMensagem> {
    const { idPessoa, idTelefone, ...body } = dados;
    return fetchAutenticado(
        'PATCH',
        `/pessoas/${idPessoa}/telefones/${idTelefone}`,
        token,
        perfilAtivo,
        body
    );
}

export function servicoDeleteTelefonePessoa(
    token: string,
    perfilAtivo: string,
    dados: IdentificacaoTelefonePessoa
): Promise<RespostaMensagem> {
    return fetchAutenticado(
        'DELETE',
        `/pessoas/${dados.idPessoa}/telefones/${dados.idTelefone}`,
        token,
        perfilAtivo
    );
}

export function servicoPostEnderecoPessoa(
    token: string,
    perfilAtivo: string,
    dados: NovoEnderecoPessoa
): Promise<RespostaCadastroEndereco> {
    const { idPessoa, ...body } = dados;
    return fetchAutenticado(
        'POST',
        `/pessoas/${idPessoa}/enderecos`,
        token,
        perfilAtivo,
        body
    );
}

export function servicoPatchEnderecoPessoa(
    token: string,
    perfilAtivo: string,
    dados: AtualizacaoEnderecoPessoa
): Promise<RespostaMensagem> {
    const { idPessoa, idEndereco, ...body } = dados;
    return fetchAutenticado(
        'PATCH',
        `/pessoas/${idPessoa}/enderecos/${idEndereco}`,
        token,
        perfilAtivo,
        body
    );
}

export function servicoDeleteEnderecoPessoa(
    token: string,
    perfilAtivo: string,
    dados: IdentificacaoEnderecoPessoa
): Promise<RespostaMensagem> {
    return fetchAutenticado(
        'DELETE',
        `/pessoas/${dados.idPessoa}/enderecos/${dados.idEndereco}`,
        token,
        perfilAtivo
    );
}

export async function servicoPostPessoa(
    token: string,
    perfilAtivo: string,
    dados: RequestPostPessoa
): Promise<RespostaMensagem> {
    return fetchAutenticado('POST', '/pessoas/cadastro', token, perfilAtivo, dados);
}

export async function servicoPatchPessoa(
    token: string,
    perfilAtivo: string,
    idPessoa: string,
    dados: RequestPatchPessoa
): Promise<RespostaMensagem> {
    return fetchAutenticado('PATCH', `/pessoas/${idPessoa}`, token, perfilAtivo, dados);
}

export async function servicoGetMeusDados(token: string): Promise<ResponsePessoaDTO> {
    return fetchAutenticado('GET', '/pessoas/meus-dados', token);
}

export async function servicoPatchMeusDados(
    token: string,
    dados: Omit<RequestPatchPessoa, 'documentoIdentificacao'>
): Promise<RespostaMensagem> {
    return fetchAutenticado('PATCH', '/pessoas/meus-dados', token, null, dados);
}
