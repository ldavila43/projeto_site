'use client'
import { ReactNode } from 'react';
import Card from './Card';
import CampoFiltro from './CampoFiltro';
import TabelaDados, { ColunaTabela } from './TabelaDados';
import { RotateCcw, SearchIcon } from 'lucide-react';
import { CampoFiltroConfig, AcaoHeader, MetadadosPaginacao, FiltrosBase } from '../types/listagem';

export interface TemplateListagemProps<T, TFiltros extends FiltrosBase> {
    titulo: string;
    dados: T[];
    metadados: MetadadosPaginacao;
    carregando: boolean;
    erro?: string | null;
    filtros: TFiltros;
    colunas: ColunaTabela<T>[];
    camposFiltro?: CampoFiltroConfig<TFiltros>[];
    getKey: (item: T) => string | number;
    onChangeFiltro: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onPesquisar: () => void;
    onLimparFiltros: () => void;
    onMudarPagina: (operacao: 'anterior' | 'proxima') => void;
    onMudarLimite: (limite: string) => void;
    acoesExtra?: (item: T) => ReactNode;
    acaoHeader?: AcaoHeader;
    acoesHeader?: AcaoHeader[];
    filtrosExtras?: ReactNode;
    mensagemVazio?: string;
}

export default function TemplateListagem<T, TFiltros extends FiltrosBase>({
    titulo,
    dados,
    metadados,
    carregando,
    erro,
    filtros,
    colunas,
    camposFiltro = [],
    getKey,
    onChangeFiltro,
    onPesquisar,
    onLimparFiltros,
    onMudarPagina,
    onMudarLimite,
    acoesExtra,
    acaoHeader,
    acoesHeader,
    filtrosExtras,
    mensagemVazio = 'Nenhum registro encontrado.'
}: TemplateListagemProps<T, TFiltros>) {
    const acoesCabecalho = acoesHeader ?? (acaoHeader ? [acaoHeader] : []);

    return (
        <div>
            <Card titulo={titulo}>
                <div className="space-y-4">
                    {acoesCabecalho.length > 0 && (
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Filtros de Busca</h3>
                            <div className="flex flex-wrap justify-end gap-2">
                                {acoesCabecalho.map((acao) => {
                                    const Icone = acao.icone;
                                    return (
                                        <button
                                            key={acao.label}
                                            type="button"
                                            onClick={acao.onClick}
                                            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
                                        >
                                            {Icone && <Icone className="h-4 w-4" />}
                                            {acao.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {(camposFiltro.length > 0 || filtrosExtras) && (
                        <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {camposFiltro.map(campo => {
                                
                                if (campo.tipo === 'select') {
                                    return (
                                        <div key={campo.name} className="flex flex-col">
                                            <label htmlFor={campo.name} className="text-sm font-medium text-gray-700">
                                                {campo.label}
                                            </label>
                                            <select
                                                id={campo.name}
                                                name={campo.name}
                                                value={String(filtros[campo.name] ?? '')}
                                                onChange={onChangeFiltro}
                                                className="border rounded-md p-2 text-sm"
                                            >
                                                {campo.opcoes.map(opcao => (
                                                    <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                }
                                if (campo.tipo === 'data') {
                                    return (
                                        <div key={campo.name} className="flex flex-col">
                                            <label htmlFor={campo.name} className="text-sm font-medium text-gray-700">
                                                {campo.label}
                                            </label>
                                            <input
                                                type="date"
                                                id={campo.name}
                                                name={campo.name}
                                                value={String(filtros[campo.name] ?? '')}
                                                onChange={onChangeFiltro}
                                                className="border rounded-md p-2 text-sm"
                                            />
                                        </div>
                                    );
                                }
                                return (
                                    <CampoFiltro
                                        key={campo.name}
                                        label={campo.label}
                                        id={campo.name}
                                        name={campo.name}
                                        value={String(filtros[campo.name] ?? '')}
                                        onChange={onChangeFiltro}
                                    />
                                );
                            })}
                            {filtrosExtras}
                        </div>
                    )}

                    <div className="flex flex-wrap justify-end gap-2">
                        <button
                            type="button"
                            onClick={onLimparFiltros}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Limpar filtros
                        </button>
                        <button
                            type="button"
                            onClick={onPesquisar}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <SearchIcon className="h-4 w-4" />
                            Pesquisar
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    {erro && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {erro}
                        </div>
                    )}
                    <TabelaDados<T>
                        dados={dados}
                        colunas={colunas}
                        metadados={metadados}
                        pagina={filtros.page!}
                        limite={filtros.limit!}
                        getKey={getKey}
                        onMudarPagina={onMudarPagina}
                        onMudarLimite={onMudarLimite}
                        carregando={carregando}
                        mensagemVazio={mensagemVazio}
                        acoesExtra={acoesExtra}
                    />
                </div>
            </Card>
        </div>
    );
}
