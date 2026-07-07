import { useState, useEffect, useCallback, useRef } from 'react';
import { FiltrosBase, MetadadosPaginacao } from '../types/listagem';

export interface UseListagemConfig<TFiltros extends FiltrosBase, TResponse, TItem> {
    funcao: (filtros: TFiltros) => Promise<TResponse>;
    filtrosIniciais: TFiltros;
    obterItens: (resposta: TResponse) => TItem[];
    obterMetadados: (resposta: TResponse) => MetadadosPaginacao;
    initialDados?: TResponse;
    autoBuscar?: boolean;
    debounceMs?: number;
    camposAutoBusca?: (keyof TFiltros)[];
}

export function useListagem<TFiltros extends FiltrosBase, TResponse, TItem>({
    funcao,
    filtrosIniciais,
    obterItens,
    obterMetadados,
    initialDados,
    autoBuscar = false,
    debounceMs = 500,
    camposAutoBusca
}: UseListagemConfig<TFiltros, TResponse, TItem>) {
    const [resposta, setResposta] = useState<TResponse | null>(initialDados ?? null);
    const [carregando, setCarregando] = useState(false);
    const [filtros, setFiltros] = useState<TFiltros>(filtrosIniciais);
    const primeiraRenderizacao = useRef(true);

    const carregarDados = useCallback(async (filtrosParaBuscar: TFiltros) => {
        setCarregando(true);
        try {
            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtrosParaBuscar).filter(([_, valor]) => valor !== '' && valor !== undefined)
            ) as TFiltros;

            const resultado = await funcao(filtrosLimpos);
            setResposta(resultado);
        } catch (error) {
            console.error('Erro ao buscar dados da listagem:', error);
        } finally {
            setCarregando(false);
        }
    }, [funcao]);

    useEffect(() => {
        if (initialDados === undefined) {
            carregarDados(filtrosIniciais);
        }
    }, []);

    const camposParaObservar = camposAutoBusca
        ?? (Object.keys(filtrosIniciais) as (keyof TFiltros)[]).filter(c => c !== 'page' && c !== 'limit');
    const chaveAutoBusca = camposParaObservar.map(c => `${String(c)}:${filtros[c] ?? ''}`).join('|');

    useEffect(() => {
        if (!autoBuscar) return;
        if (primeiraRenderizacao.current) {
            primeiraRenderizacao.current = false;
            return;
        }
        const timer = setTimeout(() => carregarDados(filtros), debounceMs);
        return () => clearTimeout(timer);
    }, [chaveAutoBusca]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value, page: '1' }));
    }

    function handleLimite(novoLimite: string) {
        const novosFiltros = { ...filtros, limit: novoLimite, page: '1' };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handlePagina(operacao: 'anterior' | 'proxima') {
        const paginaAtual = Number(filtros.page) || 1;
        const novaPagina = operacao === 'anterior' ? Math.max(1, paginaAtual - 1) : paginaAtual + 1;
        const novosFiltros = { ...filtros, page: novaPagina.toString() };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handlePesquisar() {
        carregarDados(filtros);
    }

    function recarregar() {
        return carregarDados(filtros);
    }

    return {
        dados: resposta ? obterItens(resposta) : [],
        metadados: resposta ? obterMetadados(resposta) : { totalRegistros: 0, totalPaginas: 1 },
        carregando,
        filtros,
        handleChange,
        handleLimite,
        handlePagina,
        handlePesquisar,
        recarregar
    };
}