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
    const [erro, setErro] = useState<string | null>(null);
    const [filtros, setFiltros] = useState<TFiltros>(filtrosIniciais);
    const primeiraRenderizacao = useRef(true);
    const filtrosIniciaisRef = useRef(filtrosIniciais);

    const carregarDados = useCallback(async (filtrosParaBuscar: TFiltros) => {
        setCarregando(true);
        setErro(null);
        try {
            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtrosParaBuscar).filter((entrada) => entrada[1] !== '' && entrada[1] !== undefined)
            ) as TFiltros;

            const resultado = await funcao(filtrosLimpos);
            setResposta(resultado);
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao carregar dados.');
        } finally {
            setCarregando(false);
        }
    }, [funcao]);

    useEffect(() => {
        if (initialDados === undefined) {
            const timer = setTimeout(() => {
                void carregarDados(filtrosIniciaisRef.current);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [carregarDados, initialDados]);

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
    }, [autoBuscar, carregarDados, chaveAutoBusca, debounceMs, filtros]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value, page: '1' }));
    }

    function alterarFiltro<Campo extends keyof TFiltros>(
        campo: Campo,
        valor: TFiltros[Campo]
    ) {
        setFiltros((anteriores) => ({
            ...anteriores,
            [campo]: valor,
            page: '1'
        }));
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

    function handleLimparFiltros() {
        const filtrosLimpos = {
            ...filtrosIniciaisRef.current,
            page: '1'
        };
        setFiltros(filtrosLimpos);

        if (!autoBuscar) {
            void carregarDados(filtrosLimpos);
        }
    }

    function recarregar() {
        return carregarDados(filtros);
    }

    return {
        dados: resposta ? obterItens(resposta) : [],
        metadados: resposta ? obterMetadados(resposta) : { totalRegistros: 0, totalPaginas: 1 },
        carregando,
        erro,
        filtros,
        alterarFiltro,
        handleChange,
        handleLimite,
        handlePagina,
        handlePesquisar,
        handleLimparFiltros,
        recarregar
    };
}
