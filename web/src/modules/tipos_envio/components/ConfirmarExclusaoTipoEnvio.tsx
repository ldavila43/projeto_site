'use client'

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { excluirTipoEnvio } from '../tiposEnvioActions';
import { TipoEnvio } from '../tiposEnvioDTO';

interface ConfirmarExclusaoTipoEnvioProps {
    tipoEnvio: TipoEnvio;
    onCancelar: () => void;
    onSucesso: (mensagem: string) => void;
}

export default function ConfirmarExclusaoTipoEnvio({
    tipoEnvio,
    onCancelar,
    onSucesso
}: ConfirmarExclusaoTipoEnvioProps) {
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function excluir() {
        setExcluindo(true);
        setErro(null);
        try {
            const mensagem = await excluirTipoEnvio(tipoEnvio.idTipoEnvio);
            onSucesso(mensagem);
        } catch (error) {
            setErro(error instanceof Error
                ? error.message
                : 'Não foi possível excluir o tipo de envio.');
        } finally {
            setExcluindo(false);
        }
    }

    return (
        <div className="space-y-5">
            <p className="text-sm text-gray-700">
                Deseja excluir o tipo de envio{' '}
                <strong>{tipoEnvio.descricao}</strong>?
            </p>
            <p className="text-sm text-gray-500">
                Tipos vinculados a envios não podem ser excluídos.
            </p>

            {erro && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {erro}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancelar}
                    disabled={excluindo}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={excluir}
                    disabled={excluindo}
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                    {excluindo ? 'Excluindo...' : 'Excluir'}
                </button>
            </div>
        </div>
    );
}
