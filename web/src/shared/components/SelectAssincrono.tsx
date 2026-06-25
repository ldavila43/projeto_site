'use client'
import { useState, useEffect } from "react";

interface DadosSelect {
    key: string,
    nome: string
}

interface SelectProps {
    label: string,
    selected: string,
    funcaoBusca: (termo: string) => Promise<DadosSelect[]>;
    onSelecionar: (idTermo: string) => void;
}

export default function SelectAssincrono({ label, selected, funcaoBusca, onSelecionar }: SelectProps) {
    const [options, setOptions] = useState<DadosSelect[]>([]);
    const [textoDigitado, setTextoDigitado] = useState(selected);
    const [carregando, setCarregando] = useState(false);
    const listId = `lista-${label.replace(/\s+/g, '-')}`;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const valor = e.target.value;
        setTextoDigitado(valor);

        const opcaoEncontrada = options.find(opcao => opcao.nome === valor);

        if (opcaoEncontrada) {
            onSelecionar(opcaoEncontrada.key);
        } else {
            onSelecionar('');
        }
    }

    useEffect(() => {
        const timeout = setTimeout(async () => {
            try {
                setCarregando(true);
                const resultado = await funcaoBusca(textoDigitado);
                setOptions(resultado);
            } catch (erro) {
                console.log(erro);
            } finally {
                setCarregando(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [textoDigitado, funcaoBusca]);

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700" htmlFor={label}>{label}</label>
            <input
                id={label}
                list={listId}
                value={textoDigitado}
                onChange={handleChange}
                className="border rounded-md p-2 text-sm"
            />
            <datalist id={listId}>
                {options.map(opcao => (
                    <option key={opcao.key} value={opcao.nome}>
                        {opcao.nome}
                    </option>
                ))}
            </datalist>
        </div>
    );
}