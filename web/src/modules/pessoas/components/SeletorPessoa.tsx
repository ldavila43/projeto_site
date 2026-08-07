'use client'

import { useCallback } from 'react';
import { buscarDadosPessoas } from '../pessoasActions';
import SeletorBuscaPessoa, {
    CriterioBuscaPessoa
} from './SeletorBuscaPessoa';

interface SeletorPessoaProps {
    label: string;
    value: string;
    onChange: (idPessoa: string) => void;
    placeholder?: string;
    required?: boolean;
}

export default function SeletorPessoa({
    label,
    value,
    onChange,
    placeholder = 'Digite o nome...',
    required = false
}: SeletorPessoaProps) {
    const buscarPessoas = useCallback(async (
        termo: string,
        criterio: CriterioBuscaPessoa
    ) => {
        const resposta = await buscarDadosPessoas({
            ...(criterio === 'nome'
                ? { nome: termo }
                : { documentoIdentificacao: termo }),
            page: '1',
            limit: '10'
        });

        return resposta.dados.map((pessoa) => {
            const identificacao = pessoa.documentoIdentificacao
                ? ` — ${pessoa.documentoIdentificacao}`
                : '';
            return {
                id: pessoa.idPessoa,
                label: `${pessoa.nome ?? 'Pessoa sem nome'}${identificacao}`
            };
        });
    }, []);

    return (
        <SeletorBuscaPessoa
            label={label}
            placeholderNome={placeholder}
            value={value}
            onChange={(id) => onChange(String(id))}
            fetcher={buscarPessoas}
            required={required}
        />
    );
}
