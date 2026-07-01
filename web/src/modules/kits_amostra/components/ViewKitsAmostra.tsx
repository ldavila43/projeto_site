'use client'
import { ReactNode } from 'react';
import Card from '@/src/shared/components/Card';
import CampoFiltro from '@/src/shared/components/CampoFIltro';
import TabelaDados, { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { SearchIcon, Plus } from 'lucide-react';
import { KitAmostra, ResponseGetKits, RequestGetKits } from '../KitsAmostraDTO';
import { useKits } from '../useKitsAmostra';

export interface KitsProps {
    funcao: (filtros: RequestGetKits) => Promise<ResponseGetKits>;
    initialDados: ResponseGetKits;
    acoesExtra?: (kit: KitAmostra) => ReactNode;
    onAbrirNovoKit?: () => void;
}

const colunas: ColunaTabela<KitAmostra>[] = [
    { chave: 'codBgk', titulo: 'Cód. BGK', className: 'font-medium text-gray-800' },
    { chave: 'codLote', titulo: 'Lote' },
    { chave: 'codApoio', titulo: 'Cód. Apoio'},
    { chave: 'tipoKit', titulo: 'Tipo do Kit' },
    { chave: 'responsavel', titulo: 'Responsável', render: (kit) => kit.responsavel || '-' },
    {
        chave: 'dataAtivacao',
        titulo: 'Ativação',
        render: (kit) => kit.dataAtivacao ? new Date(kit.dataAtivacao).toLocaleDateString('pt-BR') : '-'
    },
    {
        chave: 'dataValidade',
        titulo: 'Validade',
        render: (kit) => kit.dataValidade ? new Date(kit.dataValidade).toLocaleDateString('pt-BR') : '-'
    },
    {
        chave: 'status',
        titulo: 'Status',
        render: (kit) => (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                kit.status === 'ATIVO' ? 'bg-green-100 text-green-800' :
                kit.status === 'VENCIDO' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
            }`}>
                {kit.status}
            </span>
        )
    },
];

export default function TemplateKits({ funcao, initialDados, acoesExtra, onAbrirNovoKit }: KitsProps) {
    const {
        dados,
        carregando,
        filtros,
        handleChange,
        handleLimite,
        handlePagina,
        handlePesquisar
    } = useKits(funcao, initialDados);

    return (
        <div>
            <Card titulo='Kits de Amostra'>
                <div className="space-y-4">
                    
                    {/* Cabeçalho com botão de ação (opcional) */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Filtros de Busca</h3>
                        {onAbrirNovoKit && (
                            <button
                                type="button"
                                onClick={onAbrirNovoKit}
                                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
                            >
                                <Plus className="h-4 w-4" />
                                Novo Kit
                            </button>
                        )}
                    </div>

                    {/* Filtros */}
                    <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CampoFiltro
                            label="Código BGK"
                            id="codBgk"
                            name="codBgk"
                            value={filtros.codBgk || ''}
                            onChange={handleChange}
                        />
                        <CampoFiltro
                            label="Lote"
                            id="codLote"
                            name="codLote"
                            value={filtros.codLote || ''}
                            onChange={handleChange}
                        />
                        <CampoFiltro
                            label="Tipo de Kit"
                            id="tipoKit"
                            name="tipoKit"
                            value={filtros.tipoKit || ''}
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
                                <option value="INVÁLIDO">Invállido</option>
                                <option value="DESCARTADO">Descartado</option>
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
                    <TabelaDados<KitAmostra>
                        dados={dados?.kitsAmostra ?? []}
                        colunas={colunas}
                        metadados={dados?.metadados ?? { totalRegistros: 0, totalPaginas: 1 }}
                        pagina={filtros.page!}
                        limite={filtros.limit!}
                        getKey={(kit) => kit.idKit}
                        onMudarPagina={handlePagina}
                        onMudarLimite={handleLimite}
                        carregando={carregando}
                        mensagemVazio="Nenhum kit encontrado."
                        acoesExtra={acoesExtra}
                    />
                </div>
            </Card>
        </div>
    );
}