'use client'
import { useState } from 'react'
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import TabelaDados, { ColunaTabela } from '@/src/shared/components/TabelaDados'
import { ExamesResponseDTO, FiltrosBuscaExame, Exames } from '@/src/modules/exames/ExamesDTO'
import { Eye } from 'lucide-react';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { ReactNode } from 'react';
import Card from '@/src/shared/components/Card'
import CampoFiltro from '@/src/shared/components/CampoFiltro'
import { SearchIcon, Loader2 } from 'lucide-react'
import { useExames } from '../useExames';
import { buscarDadosExames } from '../examesActions'


const camposFiltro: CampoFiltroConfig<FiltrosBuscaExame>[] = [
    { tipo: 'texto', name: 'tipoExame', label: 'Tipo Exame' },
    { tipo: 'texto', name: 'nomePaciente', label: 'Paciente' },
    { tipo: 'texto', name: 'nomeProfissional', label: 'Profiasional' },
    {
        tipo: 'select',
        name: 'status',
        label: 'status',
        opcoes: [
            { value: 'AGUARDANDO ENVIO', label: 'Aguardando Envio' },
            { value: 'EM ANÁLISE', label: 'Em Análise' },
            { value: 'AGUARDANDO PROCESSAMENTO INTERNO', label: 'Aguardando Processamento Interno' },
            { value: 'LIBERAÇÃO PENDENTE', label: 'Liberação pendente' },
            { value: 'LIBERADO', label: 'Liberado' },
            { value: 'CANCELADO', label: 'Cancelado' },
        ]
    },
    { tipo: 'texto', name: 'protocolo', label: 'Protocolo' }
];


const colunas: ColunaTabela<Exames>[] = [
    { chave: 'protocolo', titulo: 'Protocolo', className: 'font-medium text-gray-800' },
    { chave: 'nomePaciente', titulo: 'Nome do Paciente' },
    { chave: 'tipoExame', titulo: 'Tipo de Exame' },
    { chave: 'documentoPaciente', titulo: 'Documento do Paciente' },
    { chave: 'nomeProfissional', titulo: 'Profissional' },
    {
        chave: 'dataSolicitacao',
        titulo: 'Data Solicitação',
        render: (exame) => new Date(exame.dataSolicitacao).toLocaleDateString('pt-BR')
    },
    {
        chave: 'status',
        titulo: 'Status',
        render: (exame) => (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                exame.status === 'CONCLUÍDO'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
            }`}>
                {exame.status}
            </span>
        )
    },
]

export default function TemplateExames({dadosIni}: { dadosIni: ExamesResponseDTO }) {
    const [modalAberto, setModalAberto] = useState(false);
    const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    function handleAbrirDetalhes(exames: Exames) {
        setSolicitacaoSelecionada(exames.idExame);
        setModalAberto(true);
    }

    const listagem = useListagem<FiltrosBuscaExame, ExamesResponseDTO, Exames>({
        funcao: buscarDadosExames,
        filtrosIniciais: {limit: '10', page: '1'},
        obterItens: (res) => res.dados,
        obterMetadados: (res) => res.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: [
            'tipoExame',
            'nomePaciente',
            'nomeProfissional',
            'status',
            'protocolo'
        ],
    });

    function handleFecharModal() {
        setModalAberto(false);
        setSolicitacaoSelecionada(null);
    }
    return (
        <div>
            <TemplateListagem
                titulo="Profissionais"
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(t) => t.idExame}
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
                acaoHeader={{ label: 'Nova Solicitação', onClick: () => setModalAberto(true) }}
                mensagemVazio="Nenhuma solicitacação encontrada."
            />
        </div>
    );
}