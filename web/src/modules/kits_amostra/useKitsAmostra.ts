import { useState, useEffect, useCallback } from 'react';
import { ResponseGetKits, RequestGetKits } from './KitsAmostraDTO'; // Ajuste o caminho

export function useKits(
    funcao: (filtros: RequestGetKits) => Promise<ResponseGetKits>,
    initialDados: ResponseGetKits
) {
    const [dados, setDados] = useState<ResponseGetKits | null>(initialDados);
    const [carregando, setCarregando] = useState(false);
    const [filtros, setFiltros] = useState<RequestGetKits>({
        codBgk: '',
        codLote: '',
        status: '',
        tipoKit: '',
        limit: '10',
        page: '1' // Voltamos ao padrão de string do seu DTO
    });

    const carregarDados = useCallback(async (filtrosParaBuscar: RequestGetKits) => {
        setCarregando(true);
        try {
            // Limpa as strings vazias para não quebrar a API
            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtrosParaBuscar).filter(([_, valor]) => valor !== '' && valor !== undefined)
            );

            const resultado = await funcao(filtrosLimpos);
            setDados(resultado);
        } catch (error) {
            console.error("Erro ao buscar kits:", error);
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
        filtros.codBgk,
        filtros.codLote,
        filtros.status,
        filtros.tipoKit,
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
        // Tratamento de datas e textos genéricos
        if (name.includes('data')) {
            setFiltros(prev => ({ ...prev, [name]: value ? new Date(value) : undefined, page: '1' }));
        } else {
            setFiltros(prev => ({ ...prev, [name]: value, page: '1' }));
        }
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