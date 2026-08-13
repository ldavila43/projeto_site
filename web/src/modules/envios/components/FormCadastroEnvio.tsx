'use client'

import { FormEvent, useCallback, useState } from 'react';
import { Send } from 'lucide-react';
import AsyncAutocomplete from '@/src/shared/components/AsyncAutocomplete';
import SeletorPessoa from '@/src/modules/pessoas/components/SeletorPessoa';
import { buscarTiposEnvio } from '@/src/modules/tipos_envio/tiposEnvioActions';
import {
    formatarValorEnum,
    STATUS_ENVIOS
} from '@/src/shared/utils/StatusEnum';
import type { StatusEnvio } from '@/src/shared/utils/StatusEnum';
import type { KitAmostra } from '@/src/modules/kits_amostra/KitsAmostraDTO';
import { formatarTipoAmostraKit } from '@/src/modules/kits_amostra/formatarKitAmostra';
import { cadastrarEnvio } from '../enviosActions';

interface FormCadastroEnvioProps {
    kits: Pick<
        KitAmostra,
        'idKit' | 'codBgk' | 'idTipoAmostra' | 'nomeTipoAmostra'
    >[];
    onSucesso: (mensagem: string) => void;
}

const classeCampo = 'w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

function dataHoraParaIso(valor: string): string {
    return new Date(valor).toISOString();
}

export default function FormCadastroEnvio({
    kits,
    onSucesso
}: FormCadastroEnvioProps) {
    const [idTipoEnvio, setIdTipoEnvio] = useState<number | null>(null);
    const [idPessoa, setIdPessoa] = useState('');
    const [status, setStatus] = useState<StatusEnvio>('PENDENTE');
    const [dataPrazoPostagem, setDataPrazoPostagem] = useState('');
    const [dataEnvio, setDataEnvio] = useState('');
    const [dataChegada, setDataChegada] = useState('');
    const [codRastreio, setCodRastreio] = useState('');
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

    async function enviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErro(null);

        if (!idTipoEnvio) {
            setErro('Selecione o tipo de envio.');
            return;
        }
        if (!idPessoa) {
            setErro('Selecione a pessoa destinatária.');
            return;
        }
        if (kits.length === 0) {
            setErro('Selecione ao menos um kit para envio.');
            return;
        }
        if (
            dataEnvio
            && dataChegada
            && new Date(dataChegada).getTime() < new Date(dataEnvio).getTime()
        ) {
            setErro('A data de chegada não pode ser anterior à data de envio.');
            return;
        }

        setSalvando(true);
        try {
            const mensagem = await cadastrarEnvio({
                idTipoEnvio,
                idKits: kits.map((kit) => kit.idKit),
                idPessoa,
                status,
                categoriaEnvio: 'KITS',
                ...(dataPrazoPostagem && { dataPrazoPostagem }),
                ...(dataEnvio && { dataEnvio: dataHoraParaIso(dataEnvio) }),
                ...(dataChegada && { dataChegada: dataHoraParaIso(dataChegada) }),
                ...(codRastreio.trim() && { codRastreio: codRastreio.trim() })
            });
            onSucesso(mensagem);
        } catch (causa) {
            setErro(
                causa instanceof Error
                    ? causa.message
                    : 'Não foi possível cadastrar o envio.'
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <form onSubmit={enviar} className="space-y-6">
            <section className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <h3 className="text-sm font-semibold text-blue-900">
                    Kits selecionados * ({kits.length})
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                    {kits.map((kit) => (
                        <span
                            key={kit.idKit}
                            className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-blue-800"
                        >
                            <strong className="block">{kit.codBgk}</strong>
                            {formatarTipoAmostraKit(kit) && (
                                <span className="mt-0.5 block text-xs text-blue-700">
                                    Tipo de amostra: {formatarTipoAmostraKit(kit)}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            </section>

            <p className="text-sm text-gray-600">
                Campos marcados com <strong>*</strong> são obrigatórios.
            </p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <AsyncAutocomplete
                    label="Tipo de envio *"
                    placeholder="Buscar tipo de envio..."
                    value={idTipoEnvio}
                    onChange={(id) => setIdTipoEnvio(Number(id))}
                    onInputChange={() => setIdTipoEnvio(null)}
                    fetcher={buscarOpcoesTipoEnvio}
                    required
                />

                <SeletorPessoa
                    label="Pessoa destinatária *"
                    value={idPessoa}
                    onChange={setIdPessoa}
                    required
                />

                <div>
                    <label
                        htmlFor="envio-status"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>
                    <select
                        id="envio-status"
                        value={status}
                        onChange={(evento) => setStatus(evento.target.value as StatusEnvio)}
                        className={classeCampo}
                    >
                        {STATUS_ENVIOS.map((opcao) => (
                            <option key={opcao} value={opcao}>
                                {formatarValorEnum(opcao)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="envio-categoria"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Categoria do envio
                    </label>
                    <select
                        id="envio-categoria"
                        value="KITS"
                        disabled
                        className={`${classeCampo} cursor-not-allowed bg-gray-100`}
                    >
                        <option value="KITS">KIT</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                        Envios de kits.
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="envio-prazo-postagem"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Prazo de postagem
                    </label>
                    <input
                        id="envio-prazo-postagem"
                        type="date"
                        value={dataPrazoPostagem}
                        onChange={(evento) => setDataPrazoPostagem(evento.target.value)}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label
                        htmlFor="envio-data"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Data de envio
                    </label>
                    <input
                        id="envio-data"
                        type="datetime-local"
                        value={dataEnvio}
                        onChange={(evento) => setDataEnvio(evento.target.value)}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label
                        htmlFor="envio-chegada"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Data de chegada
                    </label>
                    <input
                        id="envio-chegada"
                        type="datetime-local"
                        value={dataChegada}
                        min={dataEnvio || undefined}
                        onChange={(evento) => setDataChegada(evento.target.value)}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label
                        htmlFor="envio-codigo-rastreio"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Código de rastreio
                    </label>
                    <input
                        id="envio-codigo-rastreio"
                        value={codRastreio}
                        onChange={(evento) => setCodRastreio(evento.target.value)}
                        maxLength={255}
                        className={classeCampo}
                    />
                </div>
            </div>

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
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Send className="h-4 w-4" />
                    {salvando ? 'Enviando...' : 'Confirmar envio'}
                </button>
            </div>
        </form>
    );
}
