import { ComponentType } from 'react';

export type MetadadosPaginacao = {
    totalRegistros: number;
    totalPaginas: number;
};

export type FiltrosBase = {
    page?: string;
    limit?: string;
    [key: string]: any;
};

export type CampoFiltroConfig<TFiltros> =
    | {
        tipo: 'texto';
        name: keyof TFiltros & string;
        label: string;
        placeholder?: string;
    }
    | {
        tipo: 'select';
        name: keyof TFiltros & string;
        label: string;
        opcoes: { value: string; label: string }[];
    }
    | {
        tipo: 'data';
        name: keyof TFiltros & string;
        label: string;
    };

export type AcaoHeader = {
    label: string;
    icone?: ComponentType<{ className?: string }>;
    onClick: () => void;
};