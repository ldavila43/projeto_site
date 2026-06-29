import { useState, useEffect, useCallback } from 'react';
import { GetSolicitacoesResponse, RequestSolicitacoesDTO } from './SolicitacaoDTO';

export function useSolicitacoes(
    funcao: (filtros: RequestSolicitacoesDTO) => Promise<GetSolicitacoesResponse>,
    initialDados: GetSolicitacoesResponse
) {
    const [dados, setDados] = useState<GetSolicitacoesResponse | null>(initialDados);
    const [carregando, setCarregando] = useState(false);
    const [filtros, setFiltros] = useState<RequestSolicitacoesDTO>({
        protocolo: '',
        nomePaciente: '',
        nomeProfissional: '',
        status: '',
        limit: 10,
        page: '1'
    });

    const carregarDados = useCallback(async (filtrosParaBuscar: RequestSolicitacoesDTO) => {
        setCarregando(true);
        try {
            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtrosParaBuscar).filter(([_, valor]) => valor !== '' && valor !== undefined)
            );

            const resultado = await funcao(filtrosLimpos);
            setDados(resultado);
        } catch (error) {
            console.error("Erro ao buscar solicitações:", error);
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
        filtros.protocolo,
        filtros.nomePaciente,
        filtros.nomeProfissional,
        filtros.status,
        carregarDados
    ]);

    function handleLimite(novoLimite: string) {
        const novosFiltros = { ...filtros, limit: Number(novoLimite), page: '1' };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handlePagina(operacao: 'anterior' | 'proxima') {
        const nova = operacao === 'anterior'
            ? (Number(filtros.page) - 1).toString()
            : (Number(filtros.page) + 1).toString();

        const novosFiltros: RequestSolicitacoesDTO = { ...filtros, page: nova };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        if (name === 'dataIni' || name === 'dataFim') {
            setFiltros(prev => ({ ...prev, [name]: value ? new Date(value) : undefined, offset: 0 }));
        } else {
            setFiltros(prev => ({ ...prev, [name]: value, offset: 0 }));
        }
    }

    const paginaAtualString = String(filtros.page || 1);

    function handlePesquisar() {
        carregarDados(filtros);
    }

    return {
        dados,
        carregando,
        filtros,
        paginaAtual: paginaAtualString,
        handleLimite,
        handlePagina,
        handleChange,
        handlePesquisar
    };
}