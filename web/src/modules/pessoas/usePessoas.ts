import { useState, useEffect, useCallback } from 'react';
import { ResponsePessoaDTO } from './pessoasDTO';

export function useModalPessoa(
    isOpen: boolean,
    funcao: (filtros: object) => Promise<ResponsePessoaDTO>,
    filtros: object
) {
    const [dados, setDados] = useState<ResponsePessoaDTO | null>(null);
    const [carregando, setCarregando] = useState(false);

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        try {
            const resultado = await funcao(filtros);
            setDados(resultado);
        } catch (error) {
            console.error("Erro ao buscar dados da pessoa:", error);
        } finally {
            setCarregando(false);
        }
    }, [funcao, filtros]);

    useEffect(() => {
        if (isOpen) {
            carregarDados();
        } else {
            setDados(null);
        }
    }, [isOpen, carregarDados]);

    return { dados, carregando };
}