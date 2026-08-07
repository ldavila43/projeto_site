'use client'

import { FormEvent, useState } from 'react';
import { Save } from 'lucide-react';
import {
    atualizarTipoEnvio,
    cadastrarTipoEnvio
} from '../tiposEnvioActions';
import { TipoEnvio } from '../tiposEnvioDTO';

interface FormTipoEnvioProps {
    tipoEnvio?: TipoEnvio;
    onSucesso: (mensagem: string) => void;
}

export default function FormTipoEnvio({
    tipoEnvio,
    onSucesso
}: FormTipoEnvioProps) {
    const [descricao, setDescricao] = useState(tipoEnvio?.descricao ?? '');
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function enviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        const descricaoNormalizada = descricao.trim();

        if (!descricaoNormalizada) {
            setErro('Informe a descrição do tipo de envio.');
            return;
        }

        setSalvando(true);
        setErro(null);
        try {
            const mensagem = tipoEnvio
                ? await atualizarTipoEnvio(tipoEnvio.idTipoEnvio, {
                    descricao: descricaoNormalizada
                })
                : await cadastrarTipoEnvio({ descricao: descricaoNormalizada });
            onSucesso(mensagem);
        } catch (error) {
            setErro(error instanceof Error
                ? error.message
                : 'Não foi possível salvar o tipo de envio.');
        } finally {
            setSalvando(false);
        }
    }

    return (
        <form onSubmit={enviar} className="space-y-5">
            <div>
                <label
                    htmlFor="descricaoTipoEnvio"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Descrição *
                </label>
                <input
                    id="descricaoTipoEnvio"
                    type="text"
                    required
                    maxLength={255}
                    value={descricao}
                    onChange={(evento) => setDescricao(evento.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Ex.: Transportadora"
                />
            </div>

            {erro && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {erro}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={salvando || !descricao.trim()}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {salvando ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </form>
    );
}
