import { useState, useEffect, useCallback } from 'react';
import { ResponsePessoaDTO } from './pessoasDTO';

export function useModalPessoa(
    isOpen: boolean,
    funcao: (filtros: object) => Promise<ResponsePessoaDTO>,
    filtros: object = {}
) {
    const [dados, setDados] = useState<ResponsePessoaDTO | null>(null);
    const [carregando, setCarregando] = useState(false);

    const filtrosString = JSON.stringify(filtros);

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        try {
            const filtrosParaEnviar = JSON.parse(filtrosString);
            
            const resultado = await funcao(filtrosParaEnviar);
            setDados(resultado);
        } catch (error) {
            console.error("Erro ao buscar dados da pessoa:", error);
        } finally {
            setCarregando(false);
        }
    }, [funcao, filtrosString]);

    useEffect(() => {
        if (isOpen) {
            carregarDados();
        } else {
            setDados(prev => prev !== null ? null : prev);
        }
    }, [isOpen, carregarDados]);

    return { dados, carregando, recarregar: carregarDados };
}