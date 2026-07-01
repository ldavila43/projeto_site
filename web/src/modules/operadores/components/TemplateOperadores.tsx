'use client'
import { ReactNode } from 'react';
import Card from '@/src/shared/components/Card';
import CampoFiltro from '@/src/shared/components/CampoFIltro';
import TabelaDados, { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { SearchIcon, Loader2 } from 'lucide-react';
import { Operador, OperadoresResponse, FiltroBuscaOperadores } from '@/src/modules/operadores/operadoresDTO';
import { useOperadores } from '../useOperadores';

export interface OperadoresProps {
    funcao: (filtros: FiltroBuscaOperadores) => Promise<OperadoresResponse>,
    acoesExtra?: (operador: Operador) => ReactNode,
}

const colunas: ColunaTabela<Operador>[] = [
    { chave: 'nomeOperador', titulo: 'Nome do Operador', className: 'font-medium text-gray-800' },
    { chave: 'documentoOperador', titulo: 'Documento' },
    {
        chave: 'listaPerfis',
        titulo: 'Perfis',
        render: (operador) => {
            if (!operador.listaPerfis) return '-';
            
            if (Array.isArray(operador.listaPerfis)) {
                return operador.listaPerfis.join(', ');
            }
            return String(operador.listaPerfis);
        }
    },
    {
        chave: 'statusOperador',
        titulo: 'Status',
        render: (operador) => (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                operador.statusOperador === 'ATIVO' // Assumindo 'ATIVO' como exemplo, ajuste conforme sua API
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            }`}>
                {operador.statusOperador}
            </span>
        )
    },
];

export default function TemplateOperadores({ funcao, acoesExtra }: OperadoresProps) {
    const {
        dados,
        carregando,
        filtros,
        paginaAtual,
        handleChange,
        handleLimite,
        handlePagina,
        handlePesquisar
    } = useOperadores(funcao);

    if (carregando && !dados) {
        return (
            <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Carregando operadores...</span>
            </div>
        );
    }

    return (
        <div>
            <Card titulo='Operadores'>
                <div className="space-y-4">
                    <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CampoFiltro
                            label="Nome do Operador"
                            id="nomeOperador"
                            name="nomeOperador"
                            value={filtros.nomeOperador}
                            onChange={handleChange}
                        />
                        <CampoFiltro
                            label="Documento"
                            id="documentoOperador"
                            name="documentoOperador"
                            value={filtros.documentoOperador}
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
                                <option value="ATIVO">Ativo</option>
                                <option value="INATIVO">Inativo</option>
                            </select>
                        </div>
                        <CampoFiltro
                            label="ID do Perfil"
                            id="idPerfil"
                            name="idPerfil"
                            value={filtros.idPerfil}
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

                <TabelaDados<Operador>
                    dados={dados?.dados ?? []}
                    colunas={colunas}
                    metadados={{
                        totalRegistros: dados?.metadados.totalRegistros ?? 0,
                        totalPaginas: dados?.metadados.totalPaginas
                    }}
                    pagina={paginaAtual} // Passamos a página calculada
                    limite={filtros.limit!}
                    getKey={(operador) => operador.idOperador}
                    onMudarPagina={handlePagina}
                    onMudarLimite={handleLimite}
                    mensagemVazio="Nenhum operador encontrado."
                    acoesExtra={acoesExtra}
                    carregando={carregando}
                />
            </Card>
        </div>
    );
}