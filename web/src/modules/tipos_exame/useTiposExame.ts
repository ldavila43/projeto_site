import { useState, useEffect, useCallback } from 'react';
import { ResponseGetTiposExame, RequestGetTiposExame } from './TiposExameDTO'; // Ajuste o caminho

export function useTiposExame(
    funcao: (filtros: RequestGetTiposExame) => Promise<ResponseGetTiposExame>,
    initialDados: ResponseGetTiposExame
) {
    const [dados, setDados] = useState<ResponseGetTiposExame | null>(initialDados);
    const [carregando, setCarregando] = useState(false);
    const [filtros, setFiltros] = useState<RequestGetTiposExame>({
        descricao: '',
        status: '',
        categoriaExame: '',
        limit: '10',
        page: '1'
    });

    const carregarDados = useCallback(async (filtrosParaBuscar: RequestGetTiposExame) => {
        setCarregando(true);
        try {
            // Limpamos os filtros vazios para mandar a requisição limpa para a API
            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtrosParaBuscar).filter(([_, valor]) => valor !== '' && valor !== undefined)
            );

            const resultado = await funcao(filtrosLimpos);
            setDados(resultado);
        } catch (error) {
            console.error("Erro ao buscar tipos de exame:", error);
        } finally {
            setCarregando(false);
        }
    }, [funcao]);

    useEffect(() => {
        const timer = setTimeout(() => {
            carregarDados(filtros);
        }, 500);

        return () => clearTimeout(timer);
    }, [
        filtros.descricao,
        filtros.status,
        filtros.categoriaExame,
        carregarDados
    ]);

    function handleLimite(novoLimite: string) {
        const novosFiltros = { ...filtros, limit: novoLimite, page: '1' };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handlePagina(operacao: 'anterior' | 'proxima') {
        const paginaAtual = Number(filtros.page) || 1;
        
        const novaPagina = operacao === 'anterior'
            ? Math.max(1, paginaAtual - 1)
            : paginaAtual + 1;

        const novosFiltros = { ...filtros, page: novaPagina.toString() };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value, page: '1' }));
    }

    function handlePesquisar() {
        carregarDados(filtros);
    }

    return {
        dados,
        carregando,
        filtros,
        handleLimite,
        handlePagina,
        handleChange,
        handlePesquisar
    };
}