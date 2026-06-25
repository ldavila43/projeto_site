import { useState, useEffect, useRef } from 'react';
import { FiltrosBuscaPaciente, PacienteResponse } from '@/src/modules/pacientes/PacientesDTO';

export function usePacientes(
    funcao: (filtros: FiltrosBuscaPaciente) => Promise<PacienteResponse>,
    initialDados: PacienteResponse
) {
    const [dados, setDados] = useState<PacienteResponse>(initialDados);
    const [carregando, setCarregando] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosBuscaPaciente>({
        nome: undefined,
        limit: '10',
        page: '1',
    });

    const primeiroRender = useRef(true);

    useEffect(() => {
        if (primeiroRender.current) {
            primeiroRender.current = false;
            return;
        }

        async function buscar() {
            setCarregando(true);
            try {
                const resultado = await funcao(filtros);
                setDados(resultado);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscar();
    }, [filtros, funcao]);

    function handleLimite(novoLimite: string) {
        setFiltros(prev => ({ ...prev, limit: novoLimite, page: '1' }));
    }

    function handlePagina(operacao: 'anterior' | 'proxima') {
        setFiltros(prev => ({
            ...prev,
            page: operacao === 'anterior'
                ? (Number(prev.page) - 1).toString()
                : (Number(prev.page) + 1).toString()
        }));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    }

    function handlePesquisar() {
        setFiltros(prev => ({ ...prev, page: '1' }));
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