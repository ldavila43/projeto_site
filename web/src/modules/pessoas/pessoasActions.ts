'use server'

import {
    servicoDeleteEmailPessoa,
    servicoDeleteEnderecoPessoa,
    servicoDeleteTelefonePessoa,
    servicoGetEmailsPessoa,
    servicoGetPessoas,
    servicoGetMeusDados,
    servicoGetPessoa,
    servicoGetTelefonesPessoa,
    servicoPatchEmailPessoa,
    servicoPatchEnderecoPessoa,
    servicoPatchMeusDados,
    servicoPatchPessoa,
    servicoPatchTelefonePessoa,
    servicoPostEmailPessoa,
    servicoPostEnderecoPessoa,
    servicoPostPessoa,
    servicoPostTelefonePessoa
} from './pessoasService';
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
    PessoaDTO,
    RequestPatchPessoa,
    RequestPostPessoa,
    ResponseBuscaPessoas,
    ResponsePessoaDTO
} from './pessoasDTO';
import { obterSessao } from '@/src/shared/server/sessao';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

const PERFIS_LISTAGEM_PESSOAS = [
    PERFIS.ADMINISTRADOR,
    PERFIS.COLABORADOR
] as const;

export async function buscarDadosPessoas(
    filtros: FiltrosBuscaPessoas
): Promise<ResponseBuscaPessoas> {
    const { token, perfilAtivo } = await obterSessao({
        perfisPermitidos: PERFIS_LISTAGEM_PESSOAS
    });
    return servicoGetPessoas(token, String(perfilAtivo), filtros);
}

export async function buscarDadosPessoa(
    filtros: { idPessoa?: string }
): Promise<ResponsePessoaDTO> {
    if (!filtros.idPessoa) throw new Error('Pessoa não informada');
    const { token, perfilAtivo } = await obterSessao();
    const perfil = String(perfilAtivo);
    const [pessoa, respostaEmails, respostaTelefones] = await Promise.all([
        servicoGetPessoa(token, perfil, filtros.idPessoa),
        servicoGetEmailsPessoa(token, perfil, filtros.idPessoa),
        servicoGetTelefonesPessoa(token, perfil, filtros.idPessoa)
    ]);

    return {
        ...pessoa,
        emails: respostaEmails.emails,
        telefones: respostaTelefones.telefones
    };
}

export async function cadastrarEmailPessoa(dados: NovoEmailPessoa): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoPostEmailPessoa(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function atualizarEmailPessoa(
    dados: AtualizacaoEmailPessoa
): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoPatchEmailPessoa(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function excluirEmailPessoa(
    dados: IdentificacaoEmailPessoa
): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoDeleteEmailPessoa(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function cadastrarTelefonePessoa(
    dados: NovoTelefonePessoa
): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoPostTelefonePessoa(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function atualizarTelefonePessoa(
    dados: AtualizacaoTelefonePessoa
): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoPatchTelefonePessoa(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function excluirTelefonePessoa(
    dados: IdentificacaoTelefonePessoa
): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoDeleteTelefonePessoa(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function cadastrarEnderecoPessoa(
    dados: NovoEnderecoPessoa
): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoPostEnderecoPessoa(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function atualizarEnderecoPessoa(
    dados: AtualizacaoEnderecoPessoa
): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoPatchEnderecoPessoa(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function excluirEnderecoPessoa(
    dados: IdentificacaoEnderecoPessoa
): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoDeleteEnderecoPessoa(
        token,
        String(perfilAtivo),
        dados
    );
    return resposta.message;
}

export async function cadastrarPessoa(dados: RequestPostPessoa): Promise<string> {
    const { token, perfilAtivo } = await obterSessao();
    const resposta = await servicoPostPessoa(token, String(perfilAtivo), dados);
    return resposta.message;
}

export async function atualizarPessoa(dados: Partial<PessoaDTO>): Promise<string> {
    if (!dados.idPessoa) throw new Error('Pessoa não informada');

    const { idPessoa, ...alteracoes } = dados;
    const { token, perfilAtivo } = await obterSessao();
    const dadosPermitidos: RequestPatchPessoa = { ...alteracoes };
    if (perfilAtivo !== PERFIS.ADMINISTRADOR) {
        delete dadosPermitidos.documentoIdentificacao;
    }
    const resposta = await servicoPatchPessoa(
        token,
        String(perfilAtivo),
        idPessoa,
        dadosPermitidos
    );
    return resposta.message;
}

export async function buscarMeusDados(): Promise<ResponsePessoaDTO> {
    const { token } = await obterSessao({ exigirPerfil: false });
    return servicoGetMeusDados(token);
}

export async function atualizarMeusDados(dados: Partial<PessoaDTO>): Promise<string> {
    const alteracoes: RequestPatchPessoa = {
        nome: dados.nome,
        dataNascimento: dados.dataNascimento,
        sexo: dados.sexo,
        etnia: dados.etnia
    };
    const { token } = await obterSessao({ exigirPerfil: false });
    const resposta = await servicoPatchMeusDados(token, alteracoes);
    return resposta.message;
}
