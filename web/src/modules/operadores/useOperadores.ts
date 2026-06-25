import { useState, useEffect, useCallback } from 'react';
import { OperadoresResponse, FiltroBuscaOperadores } from './operadoresDTO';

export function useOperadores(funcao: (filtros: FiltroBuscaOperadores) => Promise<OperadoresResponse>) {
    const [dados, setDados] = useState<OperadoresResponse | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [filtros, setFiltros] = useState<FiltroBuscaOperadores>({
        nomeOperador: '',
        documentoOperador: '',
        status: '',
        idPerfil: '',
        limit: '10',
        offset: '0'
    });

    const carregarDados = useCallback(async (filtrosParaBuscar: FiltroBuscaOperadores) => {
        setCarregando(true);
        try {
            // SOLUÇÃO: Removemos todas as chaves que possuem string vazia ('')
            // Assim, não enviamos "lixo" para a API que cause o erro 400
            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtrosParaBuscar).filter(([_, valor]) => valor !== '')
            );

            const resultado: OperadoresResponse = await funcao(filtrosLimpos);
            setDados(resultado);
        } catch (error) {
            console.error("Erro ao buscar dados dos operadores:", error);
        } finally {
            setCarregando(false);
        }
    }, [funcao]);

    useEffect(() => {
        const timer = setTimeout(() => {
            carregarDados(filtros);
        }, 500);

        return () => clearTimeout(timer);
        // SOLUÇÃO: Removemos o 'carregarDados' daqui. 
        // Monitoramos apenas as variáveis que o usuário digita.
    }, [
        filtros.nomeOperador, 
        filtros.documentoOperador, 
        filtros.status, 
        filtros.idPerfil
    ]);

    function handleLimite(novoLimite: string) {
        const novosFiltros: FiltroBuscaOperadores = { 
            ...filtros, 
            limit: novoLimite, 
            offset: '0' 
        };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handlePagina(operacao: 'anterior' | 'proxima') {
        const limiteAtual = Number(filtros.limit);
        const offsetAtual = Number(filtros.offset);
        
        const novoOffset = operacao === 'anterior'
            ? Math.max(0, offsetAtual - limiteAtual)
            : offsetAtual + limiteAtual;

        const novosFiltros: FiltroBuscaOperadores = { ...filtros, offset: novoOffset.toString() };
        setFiltros(novosFiltros);
        carregarDados(novosFiltros);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value, offset: '0' }));
    }

    function handlePesquisar() {
        carregarDados(filtros);
    }

    const paginaAtual = (Math.floor(Number(filtros.offset) / Number(filtros.limit)) + 1).toString();

    return {
        dados,
        carregando,
        filtros,
        paginaAtual,
        handleLimite,
        handlePagina,
        handleChange,
        handlePesquisar
    };
}