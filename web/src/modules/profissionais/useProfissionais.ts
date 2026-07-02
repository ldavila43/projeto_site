import { useState, useEffect, useCallback } from 'react';
import { ProfissionaisResponse, FiltrosBuscaProfissional } from './profissionaisDTO';

export function useProfissionais(funcao: (filtros: FiltrosBuscaProfissional) => Promise<ProfissionaisResponse>, refreshKey: number = 0) {
    const [dados, setDados] = useState<ProfissionaisResponse | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [filtros, setFiltros] = useState<FiltrosBuscaProfissional>({
        nome: '',
        limit: '10',
        page: '1'
    });

    const carregarDados = useCallback(async (filtrosParaBuscar: FiltrosBuscaProfissional) => {
        setCarregando(true);
        try {
            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtrosParaBuscar).filter(([_, valor]) => valor !== '')
            );

            const resultado: ProfissionaisResponse = await funcao(filtrosLimpos);
            setDados(resultado);
        } catch (error) {
            console.error("Erro ao buscar dados dos profissionais:", error);
        } finally {
            setCarregando(false);
        }
    }, [funcao]);

    useEffect(() => {
        const timer = setTimeout(() => {
            carregarDados(filtros);
        }, 500);

        return () => clearTimeout(timer);
    }, [filtros.nome, carregarDados, refreshKey]);

    function handleLimite(novoLimite: string) {
        const novosFiltros: FiltrosBuscaProfissional = {
            ...filtros,
            limit: novoLimite,
            page: '1'
        };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handlePagina(operacao: 'anterior' | 'proxima') {
        const novaPagina = operacao === 'anterior'
            ? (Number(filtros.page) - 1).toString()
            : (Number(filtros.page) + 1).toString();

        const novosFiltros: FiltrosBuscaProfissional = { ...filtros, page: novaPagina };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value, page: '1' })); // Reseta a página ao pesquisar
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