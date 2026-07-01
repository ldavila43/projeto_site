'use client'
import Card from '@/src/shared/components/Card';
import CampoFiltro from '@/src/shared/components/CampoFIltro';
import TabelaDados, { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { SearchIcon, Loader2, Plus } from 'lucide-react';
import { SolicitacoesExame, GetSolicitacoesResponse, RequestSolicitacoesDTO } from '../SolicitacaoDTO';
import { useSolicitacoes } from '../useSolicitacoes';

export interface SolicitacoesProps {
    funcao: (filtros: RequestSolicitacoesDTO) => Promise<GetSolicitacoesResponse>;
    initialDados: GetSolicitacoesResponse;
    onAbrirNovaSolicitacao: () => void;
}

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

export default function TemplateSolicitacoes({ funcao, initialDados, onAbrirNovaSolicitacao }: SolicitacoesProps) {
    const {
        dados,
        carregando,
        filtros,
        handleChange,
        handleLimite,
        handlePagina,
        handlePesquisar
    } = useSolicitacoes(funcao, initialDados);

    return (
        <div>
            <Card titulo='Solicitações de Exames'>
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Filtros de Busca</h3>
                        <button
                            type="button"
                            onClick={onAbrirNovaSolicitacao}
                            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4" />
                            Nova Solicitação
                        </button>
                    </div>

                    <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CampoFiltro label="Protocolo" id="protocolo" name="protocolo" value={filtros.protocolo || ''} onChange={handleChange} />
                        <CampoFiltro label="Paciente" id="nomePaciente" name="nomePaciente" value={filtros.nomePaciente || ''} onChange={handleChange} />
                        <div className="flex flex-col">
                            <label
                                htmlFor={'status'}
                                className="text-sm font-medium text-gray-700"
                            >Status</label>

                            <select
                                id="status"
                                name="status"
                                value={filtros.status}
                                onChange={handleChange}
                                className="border rounded-md p-2 text-sm"
                            >
                                <option value="">Todos</option>
                                <option value="AMOSTRAS EM ANÁLISE">Em análise</option>
                                <option value="KIT ENVIADO">Kit enviado</option>
                                <option value="AGUARDANDO PAGAMENTO">Aguardando pagamento</option>
                                <option value="PAGA">Paga</option>
                                <option value="PRONTA">Pronta</option>
                            </select>
                        </div>
                        <CampoFiltro label="Data Início" id="dataIni" name="dataIni" value={filtros.dataIni ? new Date(filtros.dataIni).toISOString().split('T')[0] : ''} onChange={handleChange} />
                    </div>
                    
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={handlePesquisar}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <SearchIcon className="h-4 w-4" />
                            Pesquisar
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <TabelaDados<SolicitacoesExame>
                        dados={dados?.solicitacoes ?? []}
                        colunas={colunas}
                        metadados={dados?.metadados ?? { totalRegistros: 0, totalPaginas: 1 }}
                        pagina={filtros.page!}
                        limite={String(filtros.limit || 10)}
                        getKey={(sol) => sol.protocolo}
                        onMudarPagina={handlePagina}
                        onMudarLimite={handleLimite}
                        carregando={carregando}
                        mensagemVazio="Nenhuma solicitação encontrada."
                    />
                </div>
            </Card>
        </div>
    );
}