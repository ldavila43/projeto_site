'use client'

import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { excluirEnvio } from '../enviosActions';
import type { Envio } from '../enviosDTO';

interface ConfirmarExclusaoEnvioProps {
    envio: Envio;
    onCancelar: () => void;
    onSucesso: (mensagem: string) => void;
}

export default function ConfirmarExclusaoEnvio({
    envio,
    onCancelar,
    onSucesso
}: ConfirmarExclusaoEnvioProps) {
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function confirmar() {
        setExcluindo(true);
        setErro(null);
        try {
            const mensagem = await excluirEnvio(envio.idEnvio);
            onSucesso(mensagem);
        } catch (causa) {
            setErro(
                causa instanceof Error
                    ? causa.message
                    : 'Não foi possível excluir o envio.'
            );
        } finally {
            setExcluindo(false);
        }
    }

    const codigosKits = Array.isArray(envio.itensEnviados)
        ? envio.itensEnviados.map((kit) => kit.codBgk).filter(Boolean)
        : [];

    return (
        <div className="space-y-5">
            <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-red-900">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="text-sm">
                    <p className="font-semibold">
                        Confirme a exclusão do envio #{envio.idEnvio}.
                    </p>
                    <p className="mt-1">
                        Esta operação não exclui os kits vinculados.
                    </p>
                </div>
            </div>

            <dl className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 bg-white p-4 text-sm sm:grid-cols-2">
                <div>
                    <dt className="text-gray-500">Destinatário</dt>
                    <dd className="font-medium text-gray-800">
                        {envio.nomeDestinatario || '-'}
                    </dd>
                </div>
                <div>
                    <dt className="text-gray-500">Kits vinculados</dt>
                    <dd className="font-medium text-gray-800">
                        {codigosKits.join(', ') || 'Nenhum'}
                    </dd>
                </div>
            </dl>

            <p className="text-sm text-gray-600">
                O responsável será removido dos kits cujo responsável atual
                ainda seja este destinatário.
            </p>

            {erro && (
                <p
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {erro}
                </p>
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
                    onClick={() => void confirmar()}
                    disabled={excluindo}
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                    {excluindo ? 'Excluindo...' : 'Excluir envio'}
                </button>
            </div>
        </div>
    );
}
