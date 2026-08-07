'use client'

import { Dna, Link2, RefreshCw } from 'lucide-react';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import { formatarValorEnum } from '@/src/shared/utils/StatusEnum';
import { formatarData } from '@/src/shared/utils/formatarData';
import type {
    AmostraGeneticaExistente,
    DetalhesConflitoAmostraGenetica
} from '../SolicitacaoDTO';

interface ModalConflitoAmostraGeneticaProps {
    detalhes: DetalhesConflitoAmostraGenetica;
    salvando: boolean;
    onCancelar: () => void;
    onSolicitarNovaColeta: () => void;
    onVincularAmostra: (idAmostra: number) => void;
}

function CardAmostra({
    amostra,
    salvando,
    onVincular
}: {
    amostra: AmostraGeneticaExistente;
    salvando: boolean;
    onVincular: () => void;
}) {
    const protocolos = Array.isArray(amostra.protocolosVinculados)
        ? amostra.protocolosVinculados.join(', ')
        : '';
    const motivos = Array.isArray(amostra.motivosInelegibilidade)
        ? amostra.motivosInelegibilidade
        : [];

    return (
        <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h4 className="font-semibold text-gray-900">
                        Amostra #{amostra.idAmostra}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                        Coletada em {formatarData(amostra.dataColeta)} ·{' '}
                        {formatarValorEnum(amostra.status)}
                    </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    amostra.elegivelParaVinculo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                }`}>
                    {amostra.elegivelParaVinculo
                        ? 'Elegível para vínculo'
                        : 'Não elegível'}
                </span>
            </div>

            {protocolos && (
                <p className="mt-3 text-sm text-gray-600">
                    <strong>Protocolos vinculados:</strong> {protocolos}
                </p>
            )}
            {amostra.idKit !== undefined && (
                <p className="mt-2 text-sm text-gray-600">
                    <strong>Kit de origem:</strong> #{amostra.idKit}
                </p>
            )}
            {amostra.flagRecoleta && (
                <p className="mt-2 text-sm text-gray-600">
                    <strong>Origem da coleta:</strong> recoleta
                </p>
            )}
            {amostra.observacoes && (
                <p className="mt-2 text-sm text-gray-600">
                    <strong>Observações:</strong> {amostra.observacoes}
                </p>
            )}
            {motivos.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-700">
                    {motivos.map((motivo) => (
                        <li key={motivo}>{motivo}</li>
                    ))}
                </ul>
            )}

            {amostra.elegivelParaVinculo && (
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        disabled={salvando}
                        onClick={onVincular}
                        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Link2 className="h-4 w-4" />
                        Vincular esta amostra
                    </button>
                </div>
            )}
        </article>
    );
}

export default function ModalConflitoAmostraGenetica({
    detalhes,
    salvando,
    onCancelar,
    onSolicitarNovaColeta,
    onVincularAmostra
}: ModalConflitoAmostraGeneticaProps) {
    return (
        <ModalFormulario
            aberto
            titulo="Amostra genética existente"
            onClose={onCancelar}
            largura="xl"
        >
            <div className="space-y-5">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                    <div className="flex items-start gap-3">
                        <Dna className="mt-0.5 h-5 w-5 shrink-0" />
                        <div>
                            <p className="font-semibold">
                                O paciente já possui amostra genética coletada.
                            </p>
                            <p className="mt-1">
                                Escolha uma amostra elegível para reutilizar ou
                                prossiga solicitando uma nova coleta.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {detalhes.amostras.map((amostra) => (
                        <CardAmostra
                            key={amostra.idAmostra}
                            amostra={amostra}
                            salvando={salvando}
                            onVincular={() => onVincularAmostra(
                                amostra.idAmostra
                            )}
                        />
                    ))}
                </div>

                {detalhes.amostras.length === 0 && (
                    <p className="rounded-md bg-gray-100 p-4 text-sm text-gray-600">
                        Nenhuma amostra anterior foi disponibilizada para vínculo.
                    </p>
                )}

                <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
                    <button
                        type="button"
                        disabled={salvando}
                        onClick={onCancelar}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Voltar ao formulário
                    </button>
                    <button
                        type="button"
                        disabled={salvando}
                        onClick={onSolicitarNovaColeta}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                        {salvando ? 'Processando...' : 'Solicitar nova coleta'}
                    </button>
                </div>
            </div>
        </ModalFormulario>
    );
}
