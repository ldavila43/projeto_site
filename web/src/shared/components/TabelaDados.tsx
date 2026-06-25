'use client'
import { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

export interface ColunaTabela<T> {
    chave: string
    titulo: string
    className?: string
    render?: (item: T) => ReactNode
}

export interface MetadadosPaginacao {
    totalRegistros: number
    totalPaginas?: number
}

export interface TabelaDadosProps<T> {
    dados: T[]
    colunas: ColunaTabela<T>[]
    metadados: MetadadosPaginacao
    pagina: string
    limite: string
    getKey: (item: T) => string | number
    onMudarPagina: (operacao: 'anterior' | 'proxima') => void
    onMudarLimite: (novoLimite: string) => void
    carregando?: boolean
    mensagemVazio?: string
    acoesExtra?: (item: T) => ReactNode
    tituloAcoes?: string
}

export default function TabelaDados<T>({
    dados,
    colunas,
    metadados,
    pagina,
    limite,
    getKey,
    onMudarPagina,
    onMudarLimite,
    carregando,
    mensagemVazio = 'Nenhum registro encontrado.',
    acoesExtra,
    tituloAcoes = 'Ações'
}: TabelaDadosProps<T>) {
    const paginaAtual = Number(pagina)
    const disabled = paginaAtual <= 1
    const proximo = paginaAtual >= (metadados.totalPaginas ?? 1)

    return (
        <div>
            <section className="mt-6">
                <div className={`relative transition-opacity ${carregando ? 'opacity-40 pointer-events-none' : ''}`}>
                    {carregando && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
                        </div>
                    )}

                    {dados.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-gray-500">{mensagemVazio}</p>
                            <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros de busca.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-xs uppercase tracking-wide text-gray-500">
                                        {colunas.map(coluna => (
                                            <th key={coluna.chave} className="px-4 py-3 font-semibold">
                                                {coluna.titulo}
                                            </th>
                                        ))}
                                        {acoesExtra && (
                                            <th className="px-4 py-3 font-semibold text-right">{tituloAcoes}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {dados.map(item => (
                                        <tr key={getKey(item)} className="hover:bg-gray-50 transition-colors">
                                            {colunas.map(coluna => (
                                                <td
                                                    key={coluna.chave}
                                                    className={`px-4 py-3 text-gray-600 ${coluna.className ?? ''}`}
                                                >
                                                    {coluna.render
                                                        ? coluna.render(item)
                                                        : String((item as Record<string, unknown>)[coluna.chave] ?? '')}
                                                </td>
                                            ))}
                                            {acoesExtra && (
                                                <td className="px-4 py-3 text-right">
                                                    {acoesExtra(item)}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
                <label htmlFor="limite" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    Itens por página:
                    <select
                        id="limite"
                        value={limite}
                        onChange={e => onMudarLimite(e.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                        <option value='30'>30</option>
                    </select>
                </label>
                <span className="text-sm text-gray-500">
                    Total: <span className="font-semibold text-gray-700">{metadados.totalRegistros}</span>
                </span>
            </div>

            <div className="flex justify-center items-center gap-3 mt-4">
                <button
                    type="button"
                    disabled={disabled}
                    className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => onMudarPagina('anterior')}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </button>

                <span className="text-sm font-medium text-gray-700 px-2">
                    Página {pagina} de {metadados.totalPaginas ?? 1}
                </span>

                <button
                    type="button"
                    disabled={proximo}
                    className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        proximo
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => onMudarPagina('proxima')}
                >
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}