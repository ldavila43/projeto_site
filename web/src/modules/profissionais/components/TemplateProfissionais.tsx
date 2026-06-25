'use client'
import { ReactNode } from 'react';
import Card from '@/src/shared/components/Card';
import CampoFiltro from '@/src/shared/components/CampoFIltro';
import TabelaDados, { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { SearchIcon, Loader2 } from 'lucide-react';
import { ProfissionalDTO, ProfissionaisResponse, FiltrosBuscaProfissional } from '../profissionaisDTO'
import { useProfissionais } from '../useProfissionais';

export interface ProfissionaisProps {
    funcao: (filtros: FiltrosBuscaProfissional) => Promise<ProfissionaisResponse>,
    acoesExtra?: (profissional: ProfissionalDTO) => ReactNode,
}

const colunas: ColunaTabela<ProfissionalDTO>[] = [
    { chave: 'nome', titulo: 'Nome', className: 'font-medium text-gray-800' },
    { chave: 'profissaoRegistro', titulo: 'Profissão / Registro' },
    {
        chave: 'criadoEm',
        titulo: 'Criado Em',
        render: (profissional) => profissional.criadoEm ? new Date(profissional.criadoEm).toLocaleDateString('pt-BR') : '-'
    },
    {
        chave: 'atualizadoEm',
        titulo: 'Atualizado Em',
        render: (profissional) => profissional.atualizadoEm ? new Date(profissional.atualizadoEm).toLocaleDateString('pt-BR') : '-'
    },
];

export default function TemplateProfissionais({ funcao, acoesExtra }: ProfissionaisProps) {
    const {
        dados,
        carregando,
        filtros,
        handleChange,
        handleLimite,
        handlePagina,
        handlePesquisar
    } = useProfissionais(funcao);

    if (carregando && !dados) {
        return (
            <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Carregando profissionais...</span>
            </div>
        );
    }

    return (
        <div>
            <Card titulo='Profissionais de Saúde'>
                <div className="space-y-4">
                    <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CampoFiltro
                            label="Nome do Profissional"
                            id="nome"
                            name="nome"
                            value={filtros.nome}
                            onChange={handleChange}
                        />
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

                <TabelaDados<ProfissionalDTO>
                    dados={dados?.profissionais ?? []}
                    colunas={colunas}
                    metadados={{
                        totalRegistros: dados?.metadados.totalRegistros ?? 0,
                        totalPaginas: dados?.metadados.totalPaginas ?? 1
                    }}
                    pagina={filtros.page!}
                    limite={filtros.limit!}
                    getKey={(profissional) => profissional.idProfissional}
                    onMudarPagina={handlePagina}
                    onMudarLimite={handleLimite}
                    mensagemVazio="Nenhum profissional encontrado."
                    acoesExtra={acoesExtra}
                    carregando={carregando}
                />
            </Card>
        </div>
    );
}