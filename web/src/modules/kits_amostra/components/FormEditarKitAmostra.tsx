'use client'

import { FormEvent, useCallback, useState } from 'react';
import { Save } from 'lucide-react';
import AsyncAutocomplete from '@/src/shared/components/AsyncAutocomplete';
import { buscarDadosTiposKitAmostra } from '@/src/modules/tipos_kit_amostra/tiposKitAmostraActions';
import {
    KitAmostra,
    RequestPatchKitAmostra,
    STATUS_KITS
} from '../KitsAmostraDTO';
import { atualizarKitAmostra } from '../kitsAmostraActions';

interface FormEditarKitAmostraProps {
    kit: KitAmostra;
    onSucesso: () => void;
}

const classeCampo = 'w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

function dataParaInput(data?: string): string {
    return data?.slice(0, 10) ?? '';
}

export default function FormEditarKitAmostra({
    kit,
    onSucesso
}: FormEditarKitAmostraProps) {
    const valoresIniciais = {
        codBgk: kit.codBgk,
        local: kit.local ?? '',
        codigoBarras: kit.codigoBarras ?? '',
        dataValidade: dataParaInput(kit.dataValidade),
        dataAtivacao: dataParaInput(kit.dataAtivacao),
        status: kit.status
    };
    const [form, setForm] = useState({
        ...valoresIniciais,
        codigoLote: '',
        idTipoKit: 0
    });
    const [salvando, setSalvando] = useState(false);

    const buscarTiposKit = useCallback(async (busca: string) => {
        const resposta = await buscarDadosTiposKitAmostra({
            materialColeta: busca,
            limit: '10',
            page: '1'
        });
        return resposta.tiposKit.map((tipo) => ({
            id: tipo.idTipoKit,
            label: `${tipo.materialColeta} — ${tipo.tipoAmostra}`
        }));
    }, []);

    function montarAlteracoes(): RequestPatchKitAmostra {
        const alteracoes: RequestPatchKitAmostra = {};

        if (form.codBgk.trim() !== valoresIniciais.codBgk) {
            alteracoes.codBgk = form.codBgk.trim();
        }
        if (form.local !== valoresIniciais.local) {
            alteracoes.local = form.local;
        }
        if (form.codigoBarras !== valoresIniciais.codigoBarras) {
            alteracoes.codigoBarras = form.codigoBarras;
        }
        if (form.dataValidade !== valoresIniciais.dataValidade) {
            alteracoes.dataValidade = form.dataValidade;
        }
        if (
            form.dataAtivacao
            && form.dataAtivacao !== valoresIniciais.dataAtivacao
        ) {
            alteracoes.dataAtivacao = form.dataAtivacao;
        }
        if (form.status !== valoresIniciais.status) {
            alteracoes.status = form.status;
        }
        if (form.codigoLote.trim()) {
            alteracoes.codigoLote = form.codigoLote;
        }
        if (form.idTipoKit > 0) {
            alteracoes.idTipoKit = form.idTipoKit;
        }

        return alteracoes;
    }

    async function enviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        const alteracoes = montarAlteracoes();

        if (Object.keys(alteracoes).length === 0) {
            alert('Nenhuma alteração foi informada.');
            return;
        }

        setSalvando(true);
        try {
            const mensagem = await atualizarKitAmostra(kit.idKit, alteracoes);
            alert(mensagem);
            onSucesso();
        } catch (erro) {
            alert(erro instanceof Error ? erro.message : 'Erro ao atualizar o kit.');
        } finally {
            setSalvando(false);
        }
    }

    return (
        <form onSubmit={enviar} className="space-y-5">
            <p className="text-sm text-gray-600">
                Atualize somente os campos necessários do kit <strong>{kit.codBgk}</strong>.
            </p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="editar-cod-bgk" className="mb-1 block text-sm font-medium text-gray-700">
                        Código BGK
                    </label>
                    <input
                        id="editar-cod-bgk"
                        required
                        value={form.codBgk}
                        onChange={(evento) => setForm((anterior) => ({
                            ...anterior,
                            codBgk: evento.target.value
                        }))}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label htmlFor="editar-codigo-lote" className="mb-1 block text-sm font-medium text-gray-700">
                        Novo código do lote
                    </label>
                    <input
                        id="editar-codigo-lote"
                        value={form.codigoLote}
                        onChange={(evento) => setForm((anterior) => ({
                            ...anterior,
                            codigoLote: evento.target.value
                        }))}
                        placeholder="Deixe vazio para manter o atual"
                        className={classeCampo}
                    />
                </div>

                <AsyncAutocomplete
                    label="Alterar tipo do kit"
                    placeholder="Deixe vazio para manter o atual..."
                    value={form.idTipoKit || ''}
                    onChange={(id) => setForm((anterior) => ({
                        ...anterior,
                        idTipoKit: Number(id)
                    }))}
                    fetcher={buscarTiposKit}
                />

                <div>
                    <label htmlFor="editar-local" className="mb-1 block text-sm font-medium text-gray-700">
                        Local
                    </label>
                    <input
                        id="editar-local"
                        value={form.local}
                        onChange={(evento) => setForm((anterior) => ({
                            ...anterior,
                            local: evento.target.value
                        }))}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label htmlFor="editar-codigo-barras" className="mb-1 block text-sm font-medium text-gray-700">
                        Código de barras
                    </label>
                    <input
                        id="editar-codigo-barras"
                        value={form.codigoBarras}
                        onChange={(evento) => setForm((anterior) => ({
                            ...anterior,
                            codigoBarras: evento.target.value
                        }))}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label htmlFor="editar-validade" className="mb-1 block text-sm font-medium text-gray-700">
                        Data de validade
                    </label>
                    <input
                        id="editar-validade"
                        type="date"
                        required
                        value={form.dataValidade}
                        onChange={(evento) => setForm((anterior) => ({
                            ...anterior,
                            dataValidade: evento.target.value
                        }))}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label htmlFor="editar-ativacao" className="mb-1 block text-sm font-medium text-gray-700">
                        Data de ativação
                    </label>
                    <input
                        id="editar-ativacao"
                        type="date"
                        value={form.dataAtivacao}
                        onChange={(evento) => setForm((anterior) => ({
                            ...anterior,
                            dataAtivacao: evento.target.value
                        }))}
                        className={classeCampo}
                    />
                </div>

                <div>
                    <label htmlFor="editar-status" className="mb-1 block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        id="editar-status"
                        value={form.status}
                        onChange={(evento) => setForm((anterior) => ({
                            ...anterior,
                            status: evento.target.value as typeof form.status
                        }))}
                        className={classeCampo}
                    >
                        {STATUS_KITS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={salvando}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {salvando ? 'Salvando...' : 'Salvar alterações'}
                </button>
            </div>
        </form>
    );
}
