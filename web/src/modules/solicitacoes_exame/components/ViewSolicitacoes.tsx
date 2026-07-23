'use client'
import { useState } from 'react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import ModalNovaSolicitacao from '@/src/modules/solicitacoes_exame/components/ModalNovaSolicitacao';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { SolicitacoesExame, GetSolicitacoesResponse, RequestSolicitacoesDTO } from '../SolicitacaoDTO';
import { Eye } from 'lucide-react';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosSolicitacoes } from '@/src/modules/solicitacoes_exame/solicitacoesActions'

const camposFiltro: CampoFiltroConfig<RequestSolicitacoesDTO>[] = [
    { tipo: 'data', name: 'dataIni', label: 'Data Início Solicitacação' },
    { tipo: 'data', name: 'dataFim', label: 'Data Fim Solicitacação' },
    {
        tipo: 'select',
        name: 'status',
        label: 'status',
        opcoes: [
            { value: 'SOLICITADO', label: 'Solicitado' },
            { value: 'KIT ENVIADO', label: 'Kit Enviado' },
            { value: 'AMOSTRAS EM ANÁLISE', label: 'Amostras em Análise' },
            { value: 'PRONTA', label: 'Pronta' },
            { value: 'CANCELADA', label: 'Cancelada' },
        ]
    },
    { tipo: 'texto', name: 'protocolo', label: 'Protocolo' },
    { tipo: 'texto', name: 'nomePaciente', label: 'Paciente' },
    { tipo: 'texto', name: 'nomeProfissional', label: 'Profissional' }
];


const colunas: ColunaTabela<SolicitacoesExame>[] = [
    { chave: 'protocolo', titulo: 'Protocolo', className: 'font-medium text-gray-800' },
    { chave: 'nomePaciente', titulo: 'Paciente' },
    { chave: 'nomeProfissional', titulo: 'Profissional', render: (sol) => sol.nomeProfissional || '-' },
    {
        chave: 'dataSolicitacao',
        titulo: 'Data',
        render: (sol) => new Date(sol.dataSolicitacao).toLocaleDateString('pt-BR')
    },
    { chave: 'tiposExame', titulo: 'Exames SOlicitados'},
    { chave: 'quantidadeExames', titulo: 'Qtd. Exames' },
    { chave: 'quantidadeKits', titulo: 'Qtd. Kits' },
    {
        chave: 'statusSolicitacao',
        titulo: 'Status',
        render: (sol) => (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                sol.statusSolicitacao === 'CONCLUÍDO' ? 'bg-green-100 text-green-800' :
                sol.statusSolicitacao === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}>
                {sol.statusSolicitacao}
            </span>
        )
    },
];

export default function TemplateSolicitacoes({dadosIni}: { dadosIni: GetSolicitacoesResponse }) {
    const [modalNovaSolicitacaoAberto, setModalNovaSolicitacaoAberto] = useState(false);
    const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
    const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    function handleAbrirDetalhes(solicitacao: SolicitacoesExame) {
        setSolicitacaoSelecionada(solicitacao.idSolicitacao);
        setModalDetalhesAberto(true);
    }

    function handleAbrirNovaSolicitacao(solicitacao: SolicitacoesExame) {
        setModalNovaSolicitacaoAberto(true);
    }

    const listagem = useListagem<RequestSolicitacoesDTO, GetSolicitacoesResponse, SolicitacoesExame>({
        funcao: buscarDadosSolicitacoes,
        filtrosIniciais: {limit: '10', page: '1'},
        obterItens: (res) => res.solicitacoes,
        obterMetadados: (res) => res.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: [
            'dataIni',
            'dataFim',
            'status',
            'protocolo',
            'nomePaciente',
            'nomeProfissional'
        ],
    });

    function handleFecharModalNovaSolicitacaoAberto() {
        setModalNovaSolicitacaoAberto(false);
    }

    function handleFecharModalDetalhes() {
        setModalDetalhesAberto(false);
        setSolicitacaoSelecionada(null);
    }

    return (
        <div>
            <TemplateListagem
                titulo="Profissionais"
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(t) => t.idSolicitacao}
                dados={listagem.dados}
                metadados={listagem.metadados}
                carregando={listagem.carregando}
                filtros={listagem.filtros}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                acoesExtra={(profissional) => (
                    <button
                        onClick={() => handleAbrirDetalhes(profissional)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                )}
                acaoHeader={{ label: 'Nova Solicitação', onClick: () => setModalNovaSolicitacaoAberto(true) }}
                mensagemVazio="Nenhuma solicitacação encontrada."
            />
            
            <ModalNovaSolicitacao
                isOpen={modalNovaSolicitacaoAberto}
                onClose={() => setModalNovaSolicitacaoAberto(false)}
                onSucesso={() => { setModalNovaSolicitacaoAberto(false); listagem.recarregar(); }}
            />
        </div>
    );
}