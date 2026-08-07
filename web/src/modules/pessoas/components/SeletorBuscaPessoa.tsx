'use client'

import { useId, useState } from 'react';
import AsyncAutocomplete, {
    AutocompleteOption
} from '@/src/shared/components/AsyncAutocomplete';

export type CriterioBuscaPessoa = 'nome' | 'cpf';

interface SeletorBuscaPessoaProps {
    label: string;
    value: string | number | null;
    onChange: (id: string | number, label: string) => void;
    fetcher: (
        termo: string,
        criterio: CriterioBuscaPessoa
    ) => Promise<AutocompleteOption[]>;
    placeholderNome?: string;
    placeholderCpf?: string;
    required?: boolean;
}

export default function SeletorBuscaPessoa({
    label,
    value,
    onChange,
    fetcher,
    placeholderNome = 'Digite o nome...',
    placeholderCpf = 'Digite o CPF...',
    required = false
}: SeletorBuscaPessoaProps) {
    const [criterio, setCriterio] = useState<CriterioBuscaPessoa>('nome');
    const idCriterio = useId();

    function alterarCriterio(novoCriterio: CriterioBuscaPessoa) {
        setCriterio(novoCriterio);
        onChange('', '');
    }

    return (
        <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <div className="flex flex-col">
                <label
                    htmlFor={idCriterio}
                    className="mb-1 text-sm font-medium text-gray-700"
                >
                    Buscar por
                </label>
                <select
                    id={idCriterio}
                    value={criterio}
                    onChange={(evento) => alterarCriterio(
                        evento.target.value as CriterioBuscaPessoa
                    )}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="nome">Nome</option>
                    <option value="cpf">CPF</option>
                </select>
            </div>

            <AsyncAutocomplete
                key={criterio}
                label={label}
                placeholder={
                    criterio === 'nome' ? placeholderNome : placeholderCpf
                }
                value={value}
                onChange={onChange}
                onInputChange={() => onChange('', '')}
                fetcher={(termo) => fetcher(termo, criterio)}
                required={required}
            />
        </div>
    );
}
