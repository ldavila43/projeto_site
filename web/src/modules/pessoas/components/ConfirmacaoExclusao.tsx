'use client'

import { Loader2, Trash2 } from 'lucide-react';

interface ConfirmacaoExclusaoProps {
    mensagem: string;
    processando: boolean;
    onCancelar: () => void;
    onConfirmar: () => void;
}

export default function ConfirmacaoExclusao({
    mensagem,
    processando,
    onCancelar,
    onConfirmar
}: ConfirmacaoExclusaoProps) {
    return (
        <div
            className="mt-3 rounded-md border border-red-200 bg-red-50 p-3"
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirmar exclusão"
        >
            <p className="text-sm text-red-800">{mensagem}</p>
            <div className="mt-3 flex justify-end gap-2">
                <button
                    type="button"
                    disabled={processando}
                    onClick={onCancelar}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    disabled={processando}
                    onClick={onConfirmar}
                    className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                >
                    {processando
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    Excluir
                </button>
            </div>
        </div>
    );
}
