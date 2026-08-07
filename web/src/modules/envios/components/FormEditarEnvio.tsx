'use client'

import { FormEvent, useCallback, useState } from 'react';
import { Save } from 'lucide-react';
import AsyncAutocomplete from '@/src/shared/components/AsyncAutocomplete';
import { buscarTiposEnvio } from '@/src/modules/tipos_envio/tiposEnvioActions';
import {
    formatarValorEnum,
    STATUS_ENVIOS
} from '@/src/shared/utils/StatusEnum';
import type { StatusEnvio } from '@/src/shared/utils/StatusEnum';
import { atualizarEnvio } from '../enviosActions';
import type { Envio, RequestPatchEnvio } from '../enviosDTO';

interface FormEditarEnvioProps {
    envio: Envio;
    onSucesso: (mensagem: string) => void;
}

const classeCampo = 'w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

function dataParaInput(data: string | null): string {
    return data?.slice(0, 10) ?? '';
}

function dataHoraParaInput(data: string | null): string {
    if (!data) return '';
    const valor = new Date(data);
    if (Number.isNaN(valor.getTime())) return '';

    const completar = (numero: number) => String(numero).padStart(2, '0');
    return [
        valor.getFullYear(),
        completar(valor.getMonth() + 1),
        completar(valor.getDate())
    ].join('-') + `T${completar(valor.getHours())}:${completar(valor.getMinutes())}`;
}

function dataHoraParaIso(data: string): string {
    return new Date(data).toISOString();
}

export default function FormEditarEnvio({
    envio,
    onSucesso
}: FormEditarEnvioProps) {
    const valoresIniciais = {
        status: envio.status,
        dataPrazoPostagem: dataParaInput(envio.dataPrazoPostagem),
        dataEnvio: dataHoraParaInput(envio.dataEnvio),
        dataChegada: dataHoraParaInput(envio.dataChegada),
        codRastreio: envio.codRastreio ?? ''
    };
    const [idTipoEnvio, setIdTipoEnvio] = useState<number | null>(null);
    const [status, setStatus] = useState<StatusEnvio>(valoresIniciais.status);
    const [dataPrazoPostagem, setDataPrazoPostagem] = useState(
        valoresIniciais.dataPrazoPostagem
    );
    const [dataEnvio, setDataEnvio] = useState(valoresIniciais.dataEnvio);
    const [dataChegada, setDataChegada] = useState(valoresIniciais.dataChegada);
    const [codRastreio, setCodRastreio] = useState(valoresIniciais.codRastreio);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const buscarOpcoesTipoEnvio = useCallback(async (descricao: string) => {
        const resposta = await buscarTiposEnvio({
            descricao,
            page: '1',
            limit: '10'
        });
        return resposta.dados.map((tipo) => ({
            id: tipo.idTipoEnvio,
            label: tipo.descricao
        }));
    }, []);

    function montarAlteracoes(): RequestPatchEnvio {
        const alteracoes: RequestPatchEnvio = {};

        if (idTipoEnvio) alteracoes.idTipoEnvio = idTipoEnvio;
        if (status !== valoresIniciais.status) alteracoes.status = status;
        if (dataPrazoPostagem !== valoresIniciais.dataPrazoPostagem) {
            alteracoes.dataPrazoPostagem = dataPrazoPostagem || null;
        }
        if (dataEnvio !== valoresIniciais.dataEnvio) {
            alteracoes.dataEnvio = dataHoraParaIso(dataEnvio);
        }
        if (dataChegada !== valoresIniciais.dataChegada) {
            alteracoes.dataChegada = dataChegada
                ? dataHoraParaIso(dataChegada)
                : null;
        }

        const rastreioNormalizado = codRastreio.trim();
        if (rastreioNormalizado !== valoresIniciais.codRastreio) {
            alteracoes.codRastreio = rastreioNormalizado || null;
        }

        return alteracoes;
    }

    async function enviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErro(null);

        if (
            dataChegada
            && new Date(dataChegada).getTime() < new Date(dataEnvio).getTime()
        ) {
            setErro('A data de chegada não pode ser anterior à data de envio.');
            return;
        }

        const alteracoes = montarAlteracoes();
        if (Object.keys(alteracoes).length === 0) {
            setErro('Nenhuma alteração foi informada.');
            return;
        }

        setSalvando(true);
        try {
            const mensagem = await atualizarEnvio(envio.idEnvio, alteracoes);
            onSucesso(mensagem);
        } catch (causa) {
            setErro(
                causa instanceof Error
                    ? causa.message
                    : 'Não foi possível atualizar o envio.'
            );
        } finally {
            setSalvando(false);
        }
    }

    const devolvendo = status === 'DEVOLVIDO'
        && valoresIniciais.status !== 'DEVOLVIDO';

    return (
        <form onSubmit={enviar} className="space-y-6">
            <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-700">
                <p>
                    Envio <strong>#{envio.idEnvio}</strong> para{' '}
                    <strong>{envio.nomeDestinatario}</strong>.
                </p>
                <p className="mt-1 text-gray-500">
                    Destinatário, categoria e kits vinculados não podem ser
                    alterados por esta operação.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <AsyncAutocomplete
                    label="Alterar tipo de envio"
                    placeholder="Deixe vazio para manter o tipo atual..."
                    value={idTipoEnvio}
                    onChange={(id) => setIdTipoEnvio(Number(id))}
                    onInputChange={() => setIdTipoEnvio(null)}
                    fetcher={buscarOpcoesTipoEnvio}
                />

                <div>
                    <label
                        htmlFor="editar-envio-status"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>
                    <select
                        id="editar-envio-status"
                        value={status}
                        disabled={valoresIniciais.status === 'DEVOLVIDO'}
                        onChange={(evento) => setStatus(
                            evento.target.value as StatusEnvio
                        )}
                        className={`${classeCampo} disabled:cursor-not-allowed disabled:bg-gray-100`}
                    >
                        {STATUS_ENVIOS.map((opcao) => (
                            <option key={opcao} value={opcao}>
                                {formatarValorEnum(opcao)}
                            </option>
                        ))}
                    </select>
                    {valoresIniciais.status === 'DEVOLVIDO' && (
                        <p className="mt-1 text-xs text-gray-500">
                            Devolvido é um status terminal.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="editar-envio-prazo"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Prazo de postagem
                    </label>
                    <input
                        id="editar-envio-prazo"
                        type="date"
                        value={dataPrazoPostagem}
                        onChange={(evento) => setDataPrazoPostagem(evento.target.value)}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label
                        htmlFor="editar-envio-data"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Data de envio
                    </label>
                    <input
                        id="editar-envio-data"
                        type="datetime-local"
                        required
                        value={dataEnvio}
                        onChange={(evento) => setDataEnvio(evento.target.value)}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label
                        htmlFor="editar-envio-chegada"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Data de chegada
                    </label>
                    <input
                        id="editar-envio-chegada"
                        type="datetime-local"
                        value={dataChegada}
                        min={dataEnvio || undefined}
                        onChange={(evento) => setDataChegada(evento.target.value)}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label
                        htmlFor="editar-envio-rastreio"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Código de rastreio
                    </label>
                    <input
                        id="editar-envio-rastreio"
                        value={codRastreio}
                        onChange={(evento) => setCodRastreio(evento.target.value)}
                        className={classeCampo}
                    />
                </div>
            </div>

            {devolvendo && (
                <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    Ao marcar o envio como devolvido, o backend liberará a
                    responsabilidade dos kits que ainda pertençam a este
                    destinatário. Essa transição não poderá ser desfeita.
                </p>
            )}

            {erro && (
                <p
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {erro}
                </p>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={salvando}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {salvando ? 'Salvando...' : 'Salvar alterações'}
                </button>
            </div>
        </form>
    );
}
