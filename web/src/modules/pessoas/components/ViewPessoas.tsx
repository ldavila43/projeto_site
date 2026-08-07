'use client'

import { useContext, useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { AuthContext } from '@/src/shared/AuthContext';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import { formatarData } from '@/src/shared/utils/formatarData';
import {
    atualizarPessoa,
    buscarDadosPessoa,
    buscarDadosPessoas
} from '../pessoasActions';
import {
    FiltrosBuscaPessoas,
    PessoaListagemDTO,
    ResponseBuscaPessoas
} from '../pessoasDTO';
import FormCadastroPessoa from './FormCadastroPessoa';
import ModalDetalhesPessoa from './ModalDetalhesPessoa';

const nomesPapeis = {
    PACIENTE: 'Paciente',
    PROFISSIONAL_SAUDE: 'Profissional de saúde',
    FUNCIONARIO: 'Funcionário'
} as const;

const camposFiltro: CampoFiltroConfig<FiltrosBuscaPessoas>[] = [
    { tipo: 'texto', name: 'nome', label: 'Nome' },
    { tipo: 'texto', name: 'documentoIdentificacao', label: 'Documento' },
    { tipo: 'data', name: 'dataNascimento', label: 'Data de nascimento' },
    {
        tipo: 'select',
        name: 'sexo',
        label: 'Sexo',
        opcoes: [
            { value: '', label: 'Todos' },
            { value: 'MASCULINO', label: 'Masculino' },
            { value: 'FEMININO', label: 'Feminino' }
        ]
    },
    { tipo: 'texto', name: 'etnia', label: 'Etnia' }
];

const colunas: ColunaTabela<PessoaListagemDTO>[] = [
    {
        chave: 'nome',
        titulo: 'Nome',
        className: 'font-medium text-gray-800',
        render: (pessoa) => pessoa.nome || '-'
    },
    {
        chave: 'documentoIdentificacao',
        titulo: 'Documento',
        render: (pessoa) => pessoa.documentoIdentificacao || '-'
    },
    {
        chave: 'papeis',
        titulo: 'Papéis',
        render: (pessoa) => pessoa.papeis
            .map((papel) => nomesPapeis[papel])
            .join(', ') || '-'
    },
    {
        chave: 'dataNascimento',
        titulo: 'Data de nascimento',
        render: (pessoa) => formatarData(pessoa.dataNascimento)
    },
    {
        chave: 'sexo',
        titulo: 'Sexo',
        render: (pessoa) => pessoa.sexo || '-'
    }
];

export default function ViewPessoas({
    dadosIni
}: {
    dadosIni: ResponseBuscaPessoas;
}) {
    const contexto = useContext(AuthContext);
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [idPessoaSelecionada, setIdPessoaSelecionada] = useState<string | null>(null);

    const listagem = useListagem<
        FiltrosBuscaPessoas,
        ResponseBuscaPessoas,
        PessoaListagemDTO
    >({
        funcao: buscarDadosPessoas,
        filtrosIniciais: {
            nome: '',
            documentoIdentificacao: '',
            dataNascimento: '',
            sexo: '',
            etnia: '',
            limit: '10',
            page: '1'
        },
        obterItens: (resposta) => resposta.dados,
        obterMetadados: (resposta) => resposta.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: [
            'nome',
            'documentoIdentificacao',
            'dataNascimento',
            'sexo',
            'etnia'
        ]
    });

    return (
        <>
            <TemplateListagem
                titulo="Pessoas"
                dados={listagem.dados}
                metadados={listagem.metadados}
                carregando={listagem.carregando}
                erro={listagem.erro}
                filtros={listagem.filtros}
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(pessoa) => pessoa.idPessoa}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onLimparFiltros={listagem.handleLimparFiltros}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                acoesExtra={(pessoa) => (
                    <button
                        type="button"
                        onClick={() => setIdPessoaSelecionada(pessoa.idPessoa)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        aria-label={`Ver detalhes de ${pessoa.nome || 'pessoa'}`}
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                )}
                acaoHeader={{
                    label: 'Nova Pessoa',
                    icone: Plus,
                    onClick: () => setCadastroAberto(true)
                }}
                mensagemVazio="Nenhuma pessoa encontrada."
            />

            <ModalFormulario
                aberto={cadastroAberto}
                titulo="Nova Pessoa"
                onClose={() => setCadastroAberto(false)}
            >
                <FormCadastroPessoa
                    onSucesso={() => {
                        setCadastroAberto(false);
                        void listagem.recarregar();
                    }}
                />
            </ModalFormulario>

            {idPessoaSelecionada && (
                <ModalDetalhesPessoa
                    isOpen
                    onClose={() => setIdPessoaSelecionada(null)}
                    titulo="Detalhes da Pessoa"
                    funcaoBusca={buscarDadosPessoa}
                    funcaoEdicao={atualizarPessoa}
                    filtros={{ idPessoa: idPessoaSelecionada }}
                    onSucesso={() => void listagem.recarregar()}
                    permitirEditarDocumento={
                        contexto?.perfilAtivo === PERFIS.ADMINISTRADOR
                    }
                />
            )}
        </>
    );
}
