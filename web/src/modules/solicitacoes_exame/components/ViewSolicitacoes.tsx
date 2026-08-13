'use client'
import { useContext, useState } from 'react';
import { FlaskConical, Link2 } from 'lucide-react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import ModalNovaSolicitacao from '@/src/modules/solicitacoes_exame/components/ModalNovaSolicitacao';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { SolicitacoesExame, GetSolicitacoesResponse, RequestSolicitacoesDTO } from '../SolicitacaoDTO';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosSolicitacoes } from '@/src/modules/solicitacoes_exame/solicitacoesActions'
import { AuthContext } from '@/src/shared/AuthContext';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import {
    formatarValorEnum,
    STATUS_SOLICITACOES
} from '@/src/shared/utils/StatusEnum';
import { formatarData } from '@/src/shared/utils/formatarData';
import ModalVincularKitSolicitacao from './ModalVincularKitSolicitacao';
import ModalCriarAmostraSolicitacao from './ModalCriarAmostraSolicitacao';

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
    const [solicitacaoParaVinculo, setSolicitacaoParaVinculo] = useState<
        SolicitacoesExame | null
    >(null);
    const [solicitacaoParaAmostra, setSolicitacaoParaAmostra] = useState<
        SolicitacoesExame | null
    >(null);

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
                acoesExtra={podeCadastrar
                    ? (solicitacao) => {
                        if (
                            !solicitacao.podeVincularKit
                            && !solicitacao.podeCriarAmostra
                        ) {
                            return null;
                        }

                        return (
                            <div className="flex flex-wrap justify-end gap-2">
                                {solicitacao.podeVincularKit && (
                                    <button
                                        type="button"
                                        onClick={() => setSolicitacaoParaVinculo(solicitacao)}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                        title={`Vincular kit; ${solicitacao.kitsPendentes} pendente(s)`}
                                    >
                                        <Link2 className="h-3.5 w-3.5" />
                                        Vincular kit ({solicitacao.kitsPendentes})
                                    </button>
                                )}
                                {solicitacao.podeCriarAmostra && (
                                    <button
                                        type="button"
                                        onClick={() => setSolicitacaoParaAmostra(solicitacao)}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                                        title={`Criar amostra; ${solicitacao.amostrasPendentes} pendente(s)`}
                                    >
                                        <FlaskConical className="h-3.5 w-3.5" />
                                        Criar amostra ({solicitacao.amostrasPendentes})
                                    </button>
                                )}
                            </div>
                        );
                    }
                    : undefined}
                mensagemVazio="Nenhuma solicitação encontrada."
            />
            
            <ModalNovaSolicitacao
                isOpen={modalNovaSolicitacaoAberto}
                onClose={() => setModalNovaSolicitacaoAberto(false)}
                onSucesso={() => { setModalNovaSolicitacaoAberto(false); listagem.recarregar(); }}
            />

            {solicitacaoParaVinculo && (
                <ModalVincularKitSolicitacao
                    solicitacao={solicitacaoParaVinculo}
                    onClose={() => setSolicitacaoParaVinculo(null)}
                    onSucesso={(mensagem) => {
                        alert(mensagem);
                        setSolicitacaoParaVinculo(null);
                        void listagem.recarregar();
                    }}
                />
            )}

            {solicitacaoParaAmostra && (
                <ModalCriarAmostraSolicitacao
                    solicitacao={solicitacaoParaAmostra}
                    onClose={() => setSolicitacaoParaAmostra(null)}
                    onSucesso={(mensagem) => {
                        alert(mensagem);
                        setSolicitacaoParaAmostra(null);
                        void listagem.recarregar();
                    }}
                />
            )}
        </div>
    );
}
