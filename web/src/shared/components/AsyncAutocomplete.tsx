'use client'
import { useState, useEffect, useRef } from 'react';
import { Loader2, Search } from 'lucide-react';

export interface AutocompleteOption {
    id: string | number;
    label: string;
}

interface AsyncAutocompleteProps {
    label: string;
    placeholder?: string;
    value: string | number | null; // O ID selecionado
    onChange: (id: string | number, label: string) => void;
    fetcher: (search: string) => Promise<AutocompleteOption[]>; // Função que busca na API
}

export default function AsyncAutocomplete({ label, placeholder, value, onChange, fetcher }: AsyncAutocompleteProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState<AutocompleteOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fecha o dropdown se clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Efeito de busca com debounce
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await fetcher(searchTerm);
                setOptions(results);
            } catch (error) {
                console.error("Erro ao buscar:", error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, isOpen, fetcher]);

    function handleSelect(option: AutocompleteOption) {
        setSearchTerm(option.label); // Mostra o nome no input
        onChange(option.id, option.label);         // Passa o ID para o formulário
        setIsOpen(false);
    }

    return (
        <div ref={wrapperRef} className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-gray-300 p-2 pl-8 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Dropdown de Resultados */}
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
                    {loading ? (
                        <div className="p-4 flex items-center justify-center text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Buscando...
                        </div>
                    ) : options.length > 0 ? (
                        <ul className="py-1 text-sm text-gray-700">
                            {options.map((opt) => (
                                <li
                                    key={opt.id}
                                    onClick={() => handleSelect(opt)}
                                    className="cursor-pointer px-4 py-2 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    {opt.label}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">Nenhum resultado encontrado.</div>
                    )}
                </div>
            )}
        </div>
    );
}