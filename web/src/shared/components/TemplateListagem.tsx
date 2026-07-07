'use client'
import { ReactNode } from 'react';
import Card from './Card';
import CampoFiltro from './CampoFiltro';
import TabelaDados, { ColunaTabela } from './TabelaDados';
import { SearchIcon } from 'lucide-react';
import { CampoFiltroConfig, AcaoHeader, MetadadosPaginacao, FiltrosBase } from '../types/listagem';

export interface TemplateListagemProps<T, TFiltros extends FiltrosBase> {
    titulo: string;
    dados: T[];
    metadados: MetadadosPaginacao;
    carregando: boolean;
    filtros: TFiltros;
    colunas: ColunaTabela<T>[];
    camposFiltro?: CampoFiltroConfig<TFiltros>[];
    getKey: (item: T) => string | number;
    onChangeFiltro: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onPesquisar: () => void;
    onMudarPagina: (operacao: 'anterior' | 'proxima') => void;
    onMudarLimite: (limite: string) => void;
    acoesExtra?: (item: T) => ReactNode;
    acaoHeader?: AcaoHeader;
    mensagemVazio?: string;
}

export default function TemplateListagem<T, TFiltros extends FiltrosBase>({
    titulo,
    dados,
    metadados,
    carregando,
    filtros,
    colunas,
    camposFiltro = [],
    getKey,
    onChangeFiltro,
    onPesquisar,
    onMudarPagina,
    onMudarLimite,
    acoesExtra,
    acaoHeader,
    mensagemVazio = 'Nenhum registro encontrado.'
}: TemplateListagemProps<T, TFiltros>) {
    const Icone = acaoHeader?.icone;

    return (
        <div>
            <Card titulo={titulo}>
                <div className="space-y-4">
                    {acaoHeader && (
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Filtros de Busca</h3>
                            <button
                                type="button"
                                onClick={acaoHeader.onClick}
                                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
                            >
                                {Icone && <Icone className="h-4 w-4" />}
                                {acaoHeader.label}
                            </button>
                        </div>
                    )}

                    {camposFiltro.length > 0 && (
                        <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {camposFiltro.map(campo =>
                                campo.tipo === 'select' ? (
                                    <div key={campo.name} className="flex flex-col">
                                        <label htmlFor={campo.name} className="text-sm font-medium text-gray-700">
                                            {campo.label}
                                        </label>
                                        <select
                                            id={campo.name}
                                            name={campo.name}
                                            value={filtros[campo.name] ?? ''}
                                            onChange={onChangeFiltro}
                                            className="border rounded-md p-2 text-sm"
                                        >
                                            {campo.opcoes.map(opcao => (
                                                <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <CampoFiltro
                                        key={campo.name}
                                        label={campo.label}
                                        id={campo.name}
                                        name={campo.name}
                                        value={filtros[campo.name] ?? ''}
                                        onChange={onChangeFiltro}
                                    />
                                )
                            )}
                        </div>
                    )}

                    <div className="flex justify-end">
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