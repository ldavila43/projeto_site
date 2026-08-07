'use client'

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalFormularioProps {
    aberto: boolean;
    titulo: string;
    onClose: () => void;
    children: ReactNode;
    largura?: 'md' | 'lg' | 'xl';
}

const larguras = {
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
};

export default function ModalFormulario({
    aberto,
    titulo,
    onClose,
    children,
    largura = 'lg'
}: ModalFormularioProps) {
    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={titulo}
        >
            <div className={`relative flex max-h-[95vh] w-full ${larguras[largura]} flex-col overflow-hidden rounded-lg bg-gray-50 shadow-xl`}>
                <div className="flex items-center justify-between border-b bg-white px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">{titulo}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Fechar ${titulo}`}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="overflow-y-auto p-6">{children}</div>
            </div>
        </div>
    );
}
