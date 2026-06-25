'use client'
import { ExamesDTO, FiltrosBuscaExame, Exames } from '@/src/modules/exames/ExamesDTO'
import { ReactNode } from 'react';
import Card from '@/src/shared/components/Card'
import CampoFiltro from '@/src/shared/components/CampoFIltro'
import TabelaDados, { ColunaTabela } from '@/src/shared/components/TabelaDados'
import { SearchIcon, Loader2 } from 'lucide-react'
import { useExames } from '../useExames'; // Importando o Hook

export interface ExamesProps {
    funcao: (filtros: FiltrosBuscaExame) => Promise<ExamesDTO>,
    acoesExtra?: (exame: Exames) => ReactNode,
    exibirFiltroPaciente?: Boolean,
    exibirFiltroProfissional?: Boolean
}

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

export default function TemplateExames({ funcao, acoesExtra, exibirFiltroPaciente, exibirFiltroProfissional }: ExamesProps) {
    // Toda a complexidade foi abstraída para esta única linha
    const {
        dados,
        carregando,
        filtrosBuscaExames,
        handleChange,
        handleLimite,
        handlePagina,
        handlePesquisar
    } = useExames(funcao);

    if (carregando) {
        return (
            <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Carregando exames...</span>
            </div>
        );
    }

    return (
        <div>
            <Card titulo='Exames'>
                <div className="space-y-4">
                    <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CampoFiltro
                            label="Protocolo"
                            id="protocolo"
                            name="protocolo"
                            value={filtrosBuscaExames.protocolo}
                            onChange={handleChange}
                        />
                        {exibirFiltroPaciente && (
                            <CampoFiltro
                                label="Paciente"
                                id="nomePaciente"
                                name="nomePaciente"
                                value={filtrosBuscaExames.nomePaciente}
                                onChange={handleChange}
                            />
                        )}
                        <CampoFiltro
                            label="Tipo Exame"
                            id="tipoExame"
                            name="tipoExame"
                            value={filtrosBuscaExames.tipoExame}
                            onChange={handleChange}
                        />
                        {exibirFiltroProfissional && (
                            <CampoFiltro
                                label="Profissional"
                                id="nomeProfissional"
                                name="nomeProfissional"
                                value={filtrosBuscaExames.nomeProfissional}
                                onChange={handleChange}
                            />
                        )}
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={handlePesquisar}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <SearchIcon className="h-4 w-4" />
                            Pesquisar
                        </button>
                    </div>
                </div>

                <TabelaDados<Exames>
                    dados={dados?.dados ?? []}
                    colunas={colunas}
                    metadados={{
                        totalRegistros: dados?.metadados.totalRegistros ?? 0,
                        totalPaginas: dados?.metadados.totalPaginas
                    }}
                    pagina={filtrosBuscaExames.page!}
                    limite={filtrosBuscaExames.limit!}
                    getKey={(exame) => exame.idExame}
                    onMudarPagina={handlePagina}
                    onMudarLimite={handleLimite}
                    mensagemVazio="Nenhum exame encontrado."
                    acoesExtra={acoesExtra}
                />
            </Card>
        </div>
    );
}