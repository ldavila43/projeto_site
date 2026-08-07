'use client'

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import {
    buscarEnderecoPorCep,
    EnderecoViaCep
} from '../cepService';

interface CampoCepProps {
    value: string;
    onChange: (cep: string) => void;
    onEnderecoEncontrado: (endereco: EnderecoViaCep) => void;
    classeCampo: string;
    required?: boolean;
}

export default function CampoCep({
    value,
    onChange,
    onEnderecoEncontrado,
    classeCampo,
    required = false
}: CampoCepProps) {
    const [buscando, setBuscando] = useState(false);
    const [encontrado, setEncontrado] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const ultimoCepBuscado = useRef(value.replace(/\D/g, ''));

    useEffect(() => {
        const cep = value.replace(/\D/g, '');

        if (cep.length !== 8) {
            ultimoCepBuscado.current = '';
            return;
        }
        if (cep === ultimoCepBuscado.current) return;

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            ultimoCepBuscado.current = cep;
            setBuscando(true);
            setEncontrado(false);
            setErro(null);

            try {
                const endereco = await buscarEnderecoPorCep(
                    cep,
                    controller.signal
                );
                onEnderecoEncontrado(endereco);
                setEncontrado(true);
            } catch (causa) {
                if (controller.signal.aborted) return;
                setErro(
                    causa instanceof Error
                        ? causa.message
                        : 'Erro ao consultar o CEP.'
                );
            } finally {
                if (!controller.signal.aborted) setBuscando(false);
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [value, onEnderecoEncontrado]);

    return (
        <label className="block text-sm font-medium text-gray-700">
            <span className="mb-1 block">CEP{required ? ' *' : ''}</span>
            <div className="relative">
                <input
                    inputMode="numeric"
                    maxLength={9}
                    required={required}
                    value={value}
                    onChange={(evento) => {
                        onChange(evento.target.value);
                        setEncontrado(false);
                        setErro(null);
                    }}
                    className={`${classeCampo} pr-9`}
                    placeholder="00000-000"
                />
                {buscando && (
                    <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-blue-600" />
                )}
                {encontrado && !buscando && (
                    <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />
                )}
            </div>
            {erro && <span className="mt-1 block text-xs text-red-600">{erro}</span>}
        </label>
    );
}
