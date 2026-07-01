'use client'
import { ReactNode } from 'react';
import Card from '@/src/shared/components/Card';
import CampoFiltro from '@/src/shared/components/CampoFIltro';
import TabelaDados, { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { SearchIcon, Plus } from 'lucide-react';
import { TipoExame, ResponseGetTiposExame, RequestGetTiposExame } from '../TiposExameDTO'; // Ajuste o caminho
import { useTiposExame } from '../useTiposExame';

export interface TiposExameProps {
    funcao: (filtros: RequestGetTiposExame) => Promise<ResponseGetTiposExame>;
    initialDados: ResponseGetTiposExame;
    acoesExtra?: (tipoExame: TipoExame) => ReactNode;
    onAbrirNovoTipo?: () => void; // Para um futuro botão de cadastro
}

const colunas: ColunaTabela<TipoExame>[] = [
    { chave: 'idTipoExame', titulo: 'ID', className: 'w-16 text-gray-500' },
    { chave: 'descricao', titulo: 'Descrição', className: 'font-medium text-gray-800' },
    { chave: 'categoriaExame', titulo: 'Categoria' },
    {
        chave: 'status',
        titulo: 'Status',
        render: (tipo) => (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                tipo.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 
                tipo.status === 'INATIVO' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
            }`}>
                {tipo.status}
            </span>
        )
    },
];

export default function TemplateTiposExame({ funcao, initialDados, acoesExtra, onAbrirNovoTipo }: TiposExameProps) {
    const {
        dados,
        carregando,
        filtros,
        handleChange,
        handleLimite,
        handlePagina,
        handlePesquisar
    } = useTiposExame(funcao, initialDados);

    return (
        <div>
            <Card titulo='Tipos de Exame'>
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Filtros de Busca</h3>
                        {onAbrirNovoTipo && (
                            <button
                                type="button"
                                onClick={onAbrirNovoTipo}
                                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
                            >
                                <Plus className="h-4 w-4" />
                                Novo Tipo de Exame
                            </button>
                        )}
                    </div>

                    <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CampoFiltro
                            label="Descrição"
                            id="descricao"
                            name="descricao"
                            value={filtros.descricao || ''}
                            onChange={handleChange}
                        />
                        <CampoFiltro
                            label="Categoria"
                            id="categoriaExame"
                            name="categoriaExame"
                            value={filtros.categoriaExame || ''}
                            onChange={handleChange}
                        />
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
                                <option value="INATIVO">Inativo</option>
                                <option value="ATIVO">Ativo</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className='flex justify-end'>
                        <button
                            type='button'
                            onClick={handlePesquisar}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <SearchIcon className="h-4 w-4" />
                            Pesquisar
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <TabelaDados<TipoExame>
                        dados={dados?.tiposExame ?? []}
                        colunas={colunas}
                        metadados={dados?.metadados ?? { totalRegistros: 0, totalPaginas: 1 }}
                        pagina={filtros.page!}
                        limite={filtros.limit!}
                        getKey={(tipo) => tipo.idTipoExame}
                        onMudarPagina={handlePagina}
                        onMudarLimite={handleLimite}
                        carregando={carregando}
                        mensagemVazio="Nenhum tipo de exame encontrado."
                        acoesExtra={acoesExtra}
                    />
                </div>
            </Card>
        </div>
    );
}