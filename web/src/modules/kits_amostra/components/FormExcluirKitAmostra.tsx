'use client'

import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { excluirKitAmostra } from '../kitsAmostraActions';
import { KitAmostra } from '../KitsAmostraDTO';

interface FormExcluirKitAmostraProps {
    kit: KitAmostra;
    onCancelar: () => void;
    onSucesso: () => void;
}

export default function FormExcluirKitAmostra({
    kit,
    onCancelar,
    onSucesso
}: FormExcluirKitAmostraProps) {
    const [excluindo, setExcluindo] = useState(false);
    const [mensagemDependencia, setMensagemDependencia] = useState('');
    const [permiteForcar, setPermiteForcar] = useState(false);

    async function excluir(forcar: boolean) {
        setExcluindo(true);
        try {
            const resultado = await excluirKitAmostra(kit.idKit, forcar);

            if (resultado.sucesso) {
                alert(resultado.mensagem);
                onSucesso();
                return;
            }

            setMensagemDependencia(resultado.mensagem);
            setPermiteForcar(resultado.permiteForcar);
        } catch (erro) {
            setMensagemDependencia(
                erro instanceof Error
                    ? erro.message
                    : 'Erro ao excluir o kit.'
            );
            setPermiteForcar(false);
        } finally {
            setExcluindo(false);
        }
    }

    function confirmarExclusao() {
        void excluir(false);
    }

    function confirmarExclusaoForcada() {
        void excluir(true);
    }

    return (
        <div className="space-y-5">
            <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-red-900">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="text-sm">
                    <p className="font-semibold">Esta operação não pode ser desfeita.</p>
                    <p className="mt-1">
                        Confirme a exclusão do kit <strong>{kit.codBgk}</strong>.
                    </p>
                </div>
            </div>

            {mensagemDependencia && (
                <div className={`rounded-md border p-4 text-sm ${
                    permiteForcar
                        ? 'border-amber-200 bg-amber-50 text-amber-900'
                        : 'border-red-200 bg-red-50 text-red-800'
                }`}>
                    <p>{mensagemDependencia}</p>
                    {permiteForcar && (
                        <p className="mt-2 font-semibold">
                            Confirme novamente para solicitar a exclusão forçada.
                        </p>
                    )}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancelar}
                    disabled={excluindo}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={permiteForcar
                        ? confirmarExclusaoForcada
                        : confirmarExclusao}
                    disabled={excluindo || (Boolean(mensagemDependencia) && !permiteForcar)}
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                    {excluindo
                        ? 'Excluindo...'
                        : permiteForcar
                            ? 'Excluir mesmo assim'
                            : 'Excluir kit'}
                </button>
            </div>
        </div>
    );
}
