'use client'

import { X } from 'lucide-react';
import FormNovoKitAmostra from './FormNovoKitAmostra';

interface ModalNovoKitAmostraProps {
    isOpen: boolean;
    onClose: () => void;
    onSucesso: () => void;
}

export default function ModalNovoKitAmostra({
    isOpen,
    onClose,
    onSucesso
}: ModalNovoKitAmostraProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-novo-kit"
        >
            <div className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-gray-50 shadow-xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-gray-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Fechar formulário"
                    aria-label="Fechar formulário"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="w-full overflow-y-auto p-4 md:p-6">
                    <FormNovoKitAmostra onSucesso={onSucesso} />
                </div>
            </div>
        </div>
    );
}
