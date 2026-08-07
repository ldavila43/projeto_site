'use client'
import { useState } from 'react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import ModalNovaSolicitacao from '@/src/modules/solicitacoes_exame/components/ModalNovaSolicitacao';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { SolicitacoesExame, GetSolicitacoesResponse, RequestSolicitacoesDTO } from '../SolicitacaoDTO';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosSolicitacoes } from '@/src/modules/solicitacoes_exame/solicitacoesActions'
import { useContext } from 'react';
import { AuthContext } from '@/src/shared/AuthContext';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import {
    formatarValorEnum,
    STATUS_SOLICITACOES
} from '@/src/shared/utils/StatusEnum';
import { formatarData } from '@/src/shared/utils/formatarData';

const camposFiltro: CampoFiltroConfig<RequestSolicitacoesDTO>[] = [
    { tipo: 'data', name: 'dataIni', label: 'Data inicial da solicitação' },
    { tipo: 'data', name: 'dataFim', label: 'Data final da solicitação' },
    {
        tipo: 'select',
        name: 'status',
        label: 'Status',
        opcoes: [
            { value: '', label: 'Todos' },
            ...STATUS_SOLICITACOES.map((status) => ({
                value: status,
                label: formatarValorEnum(status)
            }))
        ]
    },
    { tipo: 'texto', name: 'protocolo', label: 'Protocolo' },
    { tipo: 'texto', name: 'nomePaciente', label: 'Paciente' },
    { tipo: 'texto', name: 'nomeProfissional', label: 'Profissional' }
];


const colunas: ColunaTabela<SolicitacoesExame>[] = [
    {
        chave: 'protocolo',
        titulo: 'Protocolo',
        className: 'font-medium text-gray-800',
        render: (solicitacao) => solicitacao.protocolo || '-'
    },
    { chave: 'nomePaciente', titulo: 'Paciente' },
    { chave: 'nomeProfissional', titulo: 'Profissional', render: (sol) => sol.nomeProfissional || '-' },
    {
        chave: 'dataSolicitacao',
        titulo: 'Data',
        render: (sol) => formatarData(sol.dataSolicitacao)
    },
    {
        chave: 'tiposExame',
        titulo: 'Exames Solicitados',
        render: (solicitacao) => solicitacao.tiposExame?.join(', ') || '-'
    },
    { chave: 'quantidadeExames', titulo: 'Qtd. Exames' },
    { chave: 'quantidadeKits', titulo: 'Qtd. Kits' },
    {
        chave: 'kitsVinculados',
        titulo: 'Cobertura por Tipo',
        render: (solicitacao) => (
            <div className="min-w-40 space-y-1 text-xs text-gray-600">
                <p>
                    Kits vinculados:{' '}
                    <strong>{solicitacao.kitsVinculados}</strong>
                </p>
                <p>
                    Kits pendentes:{' '}
                    <strong>{solicitacao.kitsPendentes}</strong>
                </p>
                <p>
                    Amostras vinculadas:{' '}
                    <strong>{solicitacao.amostrasVinculadas}</strong>
                </p>
                <p>
                    Amostras pendentes:{' '}
                    <strong>{solicitacao.amostrasPendentes}</strong>
                </p>
            </div>
        )
    },
    {
        chave: 'podeVincularKit',
        titulo: 'Disponibilidade',
        render: (solicitacao) => (
            <div className="flex min-w-40 flex-col items-start gap-1.5">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    solicitacao.podeVincularKit
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                }`}>
                    {solicitacao.podeVincularKit
                        ? 'Pode vincular kit'
                        : 'Tipos de kit contemplados'}
                </span>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    solicitacao.podeCriarAmostra
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                }`}>
                    {solicitacao.podeCriarAmostra
                        ? 'Pode criar amostra'
                        : 'Tipos de amostra contemplados'}
                </span>
            </div>
        )
    },
    {
        chave: 'statusSolicitacao',
        titulo: 'Status',
        render: (sol) => (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                sol.statusSolicitacao === 'PRONTA'
                    ? 'bg-green-100 text-green-800'
                    : sol.statusSolicitacao === 'CANCELADA'
                        ? 'bg-red-100 text-red-800'
                        : sol.statusSolicitacao === 'AGUARDANDO PAGAMENTO'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
            }`}>
                {formatarValorEnum(sol.statusSolicitacao)}
            </span>
        )
    },
];

export default function TemplateSolicitacoes({dadosIni}: { dadosIni: GetSolicitacoesResponse }) {
    const contexto = useContext(AuthContext);
    const [modalNovaSolicitacaoAberto, setModalNovaSolicitacaoAberto] = useState(false);

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

    const podeCadastrar = contexto?.perfilAtivo === PERFIS.ADMINISTRADOR
        || contexto?.perfilAtivo === PERFIS.COLABORADOR;

    return (
        <div>
            <TemplateListagem
                titulo="Solicitações"
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(t) => t.idSolicitacao}
                dados={listagem.dados}
                metadados={listagem.metadados}
                carregando={listagem.carregando}
                erro={listagem.erro}
                filtros={listagem.filtros}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onLimparFiltros={listagem.handleLimparFiltros}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                acaoHeader={podeCadastrar
                    ? { label: 'Nova Solicitação', onClick: () => setModalNovaSolicitacaoAberto(true) }
                    : undefined}
                mensagemVazio="Nenhuma solicitação encontrada."
            />
            
            <ModalNovaSolicitacao
                isOpen={modalNovaSolicitacaoAberto}
                onClose={() => setModalNovaSolicitacaoAberto(false)}
                onSucesso={() => { setModalNovaSolicitacaoAberto(false); listagem.recarregar(); }}
            />
        </div>
    );
}
