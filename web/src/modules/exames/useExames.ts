import { useState, useEffect, useCallback } from 'react';
import { ExamesDTO, FiltrosBuscaExame } from '@/src/modules/exames/ExamesDTO';

export function useExames(funcao: (filtros: FiltrosBuscaExame) => Promise<ExamesDTO>) {
    const [dados, setDados] = useState<ExamesDTO | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [filtrosBuscaExames, setFiltrosBuscaExames] = useState<FiltrosBuscaExame>({
        tipoExame: '',
        protocolo: '',
        limit: '10',
        page: '1'
    });

    const carregarDados = useCallback(async (filtrosParaBuscar: FiltrosBuscaExame) => {
        try {
            const resultado: ExamesDTO = await funcao(filtrosParaBuscar);
            setDados(resultado);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setCarregando(false);
        }
    }, [funcao]);

    useEffect(() => {
        const timer = setTimeout(() => {
            carregarDados(filtrosBuscaExames);
        }, 500);

        return () => clearTimeout(timer);
    }, [
        filtrosBuscaExames.nomePaciente,
        filtrosBuscaExames.nomeProfissional,
        filtrosBuscaExames.protocolo,
        filtrosBuscaExames.tipoExame,
        carregarDados
    ]);

    function handleLimite(novoLimite: string) {
        const novosFiltros: FiltrosBuscaExame = { ...filtrosBuscaExames, limit: novoLimite, page: '1' };
        setFiltrosBuscaExames(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handlePagina(operacao: 'anterior' | 'proxima') {
        const nova = operacao === 'anterior'
            ? (Number(filtrosBuscaExames.page) - 1).toString()
            : (Number(filtrosBuscaExames.page) + 1).toString();

        const novosFiltros: FiltrosBuscaExame = { ...filtrosBuscaExames, page: nova };
        setFiltrosBuscaExames(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFiltrosBuscaExames(prev => ({ ...prev, [name]: value }));
    }

    function handlePesquisar() {
        carregarDados(filtrosBuscaExames);
    }

    return {
        dados,
        carregando,
        filtrosBuscaExames,
        handleLimite,
        handlePagina,
        handleChange,
        handlePesquisar
    };
}