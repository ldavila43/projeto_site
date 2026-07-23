'use client'

import { FormEvent, useCallback } from 'react';
import { Save } from 'lucide-react';
import Card from '@/src/shared/components/Card';
import AsyncAutocomplete from '@/src/shared/components/AsyncAutocomplete';
import { buscarDadosTiposKitAmostra } from '@/src/modules/tipos_kit_amostra/tiposKitAmostraActions';
import { buscarDadosOperadores } from '@/src/modules/operadores/operadoresActions';
import { cadastrarKitAmostra } from '../kitsAmostraActions';
import { STATUS_KITS } from '../KitsAmostraDTO';
import { useCadastroKitAmostra } from '../useCadastroKitAmostra';

interface FormNovoKitAmostraProps {
    onSucesso: () => void;
}

const classeCampo = 'w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

export default function FormNovoKitAmostra({ onSucesso }: FormNovoKitAmostraProps) {
    const { form, salvando, alterarCampo, enviar } = useCadastroKitAmostra(cadastrarKitAmostra);

    const buscarTiposKit = useCallback(async (busca: string) => {
        const resposta = await buscarDadosTiposKitAmostra({
            materialColeta: busca,
            status: 'ATIVO',
            limit: '10',
            page: '1'
        });

        return resposta.tiposKit.map((tipo) => ({
            id: tipo.idTipoKit,
            label: `${tipo.materialColeta} — ${tipo.tipoAmostra}`
        }));
    }, []);

    const buscarResponsaveis = useCallback(async (busca: string) => {
        const resposta = await buscarDadosOperadores({
            nomeOperador: busca,
            status: 'ATIVO',
            limit: '10',
            page: '1'
        });

        return resposta.dados.map((operador) => ({
            id: operador.idOperador,
            label: operador.nomeOperador
        }));
    }, []);

    async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        await enviar(onSucesso);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card titulo="Novo Kit de Amostra">
                <h2 id="titulo-novo-kit" className="sr-only">Cadastrar novo kit de amostra</h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label htmlFor="codBgk" className="mb-1 block text-sm font-medium text-gray-700">
                            Código BGK *
                        </label>
                        <input
                            id="codBgk"
                            type="text"
                            required
                            value={form.codBgk}
                            onChange={(evento) => alterarCampo('codBgk', evento.target.value)}
                            className={classeCampo}
                        />
                    </div>

                    <div>
                        <label htmlFor="codigoLote" className="mb-1 block text-sm font-medium text-gray-700">
                            Código do lote *
                        </label>
                        <input
                            id="codigoLote"
                            type="text"
                            required
                            value={form.codigoLote}
                            onChange={(evento) => alterarCampo('codigoLote', evento.target.value)}
                            className={classeCampo}
                        />
                    </div>

                    <AsyncAutocomplete
                        label="Tipo do kit *"
                        placeholder="Buscar tipo de kit..."
                        value={form.idTipoKit || ''}
                        onChange={(id) => alterarCampo('idTipoKit', Number(id))}
                        fetcher={buscarTiposKit}
                    />

                    <div>
                        <label htmlFor="local" className="mb-1 block text-sm font-medium text-gray-700">
                            Local
                        </label>
                        <input
                            id="local"
                            type="text"
                            value={form.local ?? ''}
                            onChange={(evento) => alterarCampo('local', evento.target.value)}
                            className={classeCampo}
                        />
                    </div>

                    <div>
                        <label htmlFor="codApoio" className="mb-1 block text-sm font-medium text-gray-700">
                            Código de apoio
                        </label>
                        <input
                            id="codApoio"
                            type="text"
                            value={form.codApoio ?? ''}
                            onChange={(evento) => alterarCampo('codApoio', evento.target.value)}
                            className={classeCampo}
                        />
                    </div>

                    <div>
                        <label htmlFor="dataValidade" className="mb-1 block text-sm font-medium text-gray-700">
                            Data de validade *
                        </label>
                        <input
                            id="dataValidade"
                            type="date"
                            required
                            value={form.dataValidade}
                            onChange={(evento) => alterarCampo('dataValidade', evento.target.value)}
                            className={classeCampo}
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                            Status *
                        </label>
                        <select
                            id="status"
                            required
                            value={form.status}
                            onChange={(evento) => alterarCampo('status', evento.target.value as typeof form.status)}
                            className={classeCampo}
                        >
                            {STATUS_KITS.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="dataAtivacao" className="mb-1 block text-sm font-medium text-gray-700">
                            Data de ativação
                        </label>
                        <input
                            id="dataAtivacao"
                            type="date"
                            value={form.dataAtivacao ?? ''}
                            onChange={(evento) => alterarCampo('dataAtivacao', evento.target.value)}
                            className={classeCampo}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <AsyncAutocomplete
                            key={form.idResponsavel || 'sem-responsavel'}
                            label="Responsável"
                            placeholder="Buscar operador responsável..."
                            value={form.idResponsavel ?? ''}
                            onChange={(id) => alterarCampo('idResponsavel', String(id))}
                            fetcher={buscarResponsaveis}
                        />
                        {form.idResponsavel && (
                            <button
                                type="button"
                                onClick={() => alterarCampo('idResponsavel', '')}
                                className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                                Remover responsável
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={salvando || !form.codBgk.trim() || !form.codigoLote.trim() || !form.idTipoKit || !form.dataValidade}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {salvando ? 'Salvando...' : 'Cadastrar Kit'}
                    </button>
                </div>
            </Card>
        </form>
    );
}
