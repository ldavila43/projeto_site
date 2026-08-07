
import { Sexo } from '@/src/shared/utils/StatusEnum';

export type PapelPessoa = 'PACIENTE' | 'PROFISSIONAL_SAUDE' | 'FUNCIONARIO';

export interface PessoaDTO {
    idPessoa: string,
    nome?: string,
    documentoIdentificacao?: string,
    dataNascimento?: string,
    sexo?: string,
    etnia?: string
}

export interface PessoaListagemDTO {
    idPessoa: string;
    nome: string | null;
    documentoIdentificacao: string | null;
    dataNascimento: string | null;
    papeis: PapelPessoa[];
    sexo: Sexo | null;
    etnia: string | null;
}

export interface FiltrosBuscaPessoas {
    nome?: string;
    dataNascimento?: string;
    documentoIdentificacao?: string;
    sexo?: Sexo | '';
    etnia?: string;
    page?: string;
    limit?: string;
}

export interface ResponseBuscaPessoas {
    dados: PessoaListagemDTO[];
    metadados: {
        totalRegistros: number;
        totalPaginas: number;
        page: number;
        limit: number;
    };
}

export interface RequestPostPessoa {
    nome: string;
    documentoIdentificacao: string;
    dataNascimento: string;
    sexo: 'MASCULINO' | 'FEMININO';
    etnia?: string;
}

export type RequestPatchPessoa = Partial<Omit<PessoaDTO, 'idPessoa'>>;

export interface RespostaMensagem {
    message: string;
}

export interface PessoasEmail {
    idEmail: number,
    idPessoa: string,
    email: string,
    tipo: string
}

export interface PessoasTelefone {
    idTelefone: number,
    idPessoa: string,
    telefone: string,
    tipo: string
}

export interface ResponseEmailsPessoa {
    emails: PessoasEmail[];
}

export interface ResponseTelefonesPessoa {
    telefones: PessoasTelefone[];
}

export const TIPOS_TELEFONE = [
    'RESIDENCIAL',
    'COMERCIAL',
    'CELULAR',
    'OUTROS'
] as const;

export const TIPOS_EMAIL = [
    'PESSOAL',
    'COMERCIAL',
    'OUTROS'
] as const;

export const TIPOS_ENDERECO = [
    'RESIDENCIAL',
    'COMERCIAL',
    'OUTRO'
] as const;

export type TipoTelefone = typeof TIPOS_TELEFONE[number];
export type TipoEmail = typeof TIPOS_EMAIL[number];
export type TipoEndereco = typeof TIPOS_ENDERECO[number];

export interface NovoEmailPessoa {
    idPessoa: string;
    email: string;
    tipo: TipoEmail;
}

export interface AtualizacaoEmailPessoa extends NovoEmailPessoa {
    idEmail: number;
}

export interface NovoTelefonePessoa {
    idPessoa: string;
    telefone: string;
    tipo: TipoTelefone;
}

export interface AtualizacaoTelefonePessoa extends NovoTelefonePessoa {
    idTelefone: number;
}

export interface IdentificacaoEmailPessoa {
    idPessoa: string;
    idEmail: number;
}

export interface IdentificacaoTelefonePessoa {
    idPessoa: string;
    idTelefone: number;
}

export interface RespostaCadastroEmail extends RespostaMensagem {
    idEmail: number;
}

export interface RespostaCadastroTelefone extends RespostaMensagem {
    idTelefone: number;
}

export interface Endereco {
    idEndereco: number,
    tipoEndereco: string,
    cep: string | null,
    logradouro: string,
    numero: string,
    complemento?: string | null,
    bairro: string | null,
    idCidade: number,
    cidade: string,
    estado: string,
    pais: string
}

export interface NovoEnderecoPessoa {
    idPessoa: string;
    tipoEndereco: TipoEndereco;
    cep?: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro?: string;
    idMunicipio: number;
}

export interface AtualizacaoEnderecoPessoa
    extends Omit<NovoEnderecoPessoa, 'idMunicipio'> {
    idEndereco: number;
    idMunicipio?: number;
}

export interface IdentificacaoEnderecoPessoa {
    idPessoa: string;
    idEndereco: number;
}

export interface RespostaCadastroEndereco extends RespostaMensagem {
    idEndereco: number;
}

export interface ResponsePessoaDTO {
    dadosPessoa: PessoaDTO,
    telefones: PessoasTelefone[],
    emails: PessoasEmail[],
    enderecos: Endereco[]
}
