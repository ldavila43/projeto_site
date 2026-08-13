'use client'

import { FormEvent, useCallback, useState } from 'react';
import { Link2, Save } from 'lucide-react';
import AsyncAutocomplete from '@/src/shared/components/AsyncAutocomplete';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import { buscarDadosKitsAmostra } from '@/src/modules/kits_amostra/kitsAmostraActions';
import { formatarResumoKitAmostra } from '@/src/modules/kits_amostra/formatarKitAmostra';
import { vincularKitSolicitacao } from '../solicitacoesActions';
import type { SolicitacoesExame } from '../SolicitacaoDTO';

interface ModalVincularKitSolicitacaoProps {
    solicitacao: SolicitacoesExame;
    onClose: () => void;
    onSucesso: (mensagem: string) => void;
}

export default function ModalVincularKitSolicitacao({
    solicitacao,
    onClose,
    onSucesso
}: ModalVincularKitSolicitacaoProps) {
    const [idKit, setIdKit] = useState<number | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const buscarKits = useCallback(async (codBgk: string) => {
        const resposta = await buscarDadosKitsAmostra({
            codBgk,
            page: '1',
            limit: '10'
        });

        return resposta.kitsAmostra.map((kit) => ({
            id: kit.idKit,
            label: formatarResumoKitAmostra(kit)
        }));
    }, []);

    async function enviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (idKit === null) return;

        setErro(null);
        setSalvando(true);
        try {
            const resultado = await vincularKitSolicitacao(
                solicitacao.idSolicitacao,
                idKit
            );
            if (!resultado.sucesso) {
                setErro(resultado.mensagem);
                return;
            }
            onSucesso(resultado.mensagem);
        } catch (causa) {
            setErro(
                causa instanceof Error
                    ? causa.message
                    : 'Não foi possível vincular o kit.'
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <ModalFormulario
            aberto
            titulo="Vincular kit à solicitação"
            onClose={onClose}
            largura="md"
        >
            <form onSubmit={enviar} className="space-y-5">
                <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
                    <p className="flex items-center gap-2 font-semibold">
                        <Link2 className="h-4 w-4" />
                        Solicitação {solicitacao.protocolo || `#${solicitacao.idSolicitacao}`}
                    </p>
                    <p className="mt-1">
                        Paciente: {solicitacao.nomePaciente}
                    </p>
                    <p className="mt-1">
                        Kits pendentes informados pela API:{' '}
                        <strong>{solicitacao.kitsPendentes}</strong>
                    </p>
                </div>

                <AsyncAutocomplete
                    label="Kit *"
                    placeholder="Buscar pelo código BGK..."
                    value={idKit}
                    onChange={(id) => setIdKit(Number(id))}
                    onInputChange={() => setIdKit(null)}
                    fetcher={buscarKits}
                    required
                />

                {erro && (
                    <p
                        role="alert"
                        className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {erro}
                    </p>
                )}

                <div className="flex justify-end gap-3 border-t pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={salvando}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={salvando || idKit === null}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {salvando ? 'Vinculando...' : 'Vincular kit'}
                    </button>
                </div>
            </form>
        </ModalFormulario>
    );
}
