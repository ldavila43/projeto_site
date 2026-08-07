'use client'

import { FormEvent, useCallback, useState } from 'react';
import {
    Loader2,
    MapPin,
    Pencil,
    Plus,
    Save,
    Trash2,
    X
} from 'lucide-react';
import {
    Endereco,
    TIPOS_ENDERECO,
    TipoEndereco
} from '../pessoasDTO';
import SeletorMunicipio from '@/src/modules/localidades/components/SeletorMunicipio';
import CampoCep from '@/src/modules/localidades/components/CampoCep';
import { EnderecoViaCep } from '@/src/modules/localidades/cepService';
import ConfirmacaoExclusao from './ConfirmacaoExclusao';

export interface DadosFormularioEndereco {
    tipoEndereco: TipoEndereco;
    cep?: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro?: string;
    idMunicipio?: number;
}

interface GerenciadorEnderecosProps {
    enderecos: Endereco[];
    onAdicionar: (
        dados: DadosFormularioEndereco & { idMunicipio: number }
    ) => Promise<void>;
    onEditar: (
        idEndereco: number,
        dados: DadosFormularioEndereco
    ) => Promise<void>;
    onExcluir: (idEndereco: number) => Promise<void>;
}

type Operacao =
    | { tipo: 'novo' }
    | { tipo: 'editar'; endereco: Endereco }
    | null;

interface EstadoFormulario {
    tipoEndereco: TipoEndereco;
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    idMunicipio: string;
}

const estadoInicial: EstadoFormulario = {
    tipoEndereco: 'RESIDENCIAL',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    idMunicipio: ''
};

const classeCampo = 'w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

export default function GerenciadorEnderecos({
    enderecos,
    onAdicionar,
    onEditar,
    onExcluir
}: GerenciadorEnderecosProps) {
    const [operacao, setOperacao] = useState<Operacao>(null);
    const [form, setForm] = useState<EstadoFormulario>(estadoInicial);
    const [alterandoMunicipio, setAlterandoMunicipio] = useState(false);
    const [idExcluir, setIdExcluir] = useState<number | null>(null);
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [localidadeCep, setLocalidadeCep] = useState<{
        uf: string;
        municipio: string;
        chave: number;
    } | null>(null);

    function alterar(campo: keyof EstadoFormulario, valor: string) {
        setForm((anterior) => ({ ...anterior, [campo]: valor }));
    }

    const alterarMunicipio = useCallback((idMunicipio: string) => {
        setForm((anterior) => ({ ...anterior, idMunicipio }));
    }, []);

    const preencherEnderecoPorCep = useCallback((endereco: EnderecoViaCep) => {
        setForm((anterior) => ({
            ...anterior,
            cep: endereco.cep.replace(/\D/g, ''),
            logradouro: endereco.logradouro || anterior.logradouro,
            bairro: endereco.bairro || anterior.bairro,
            complemento: endereco.complemento || anterior.complemento,
            idMunicipio: ''
        }));
        setAlterandoMunicipio(true);
        setLocalidadeCep({
            uf: endereco.uf,
            municipio: endereco.localidade,
            chave: Date.now()
        });
    }, []);

    function abrirNovo() {
        setForm(estadoInicial);
        setAlterandoMunicipio(true);
        setLocalidadeCep(null);
        setErro(null);
        setOperacao({ tipo: 'novo' });
    }

    function abrirEdicao(endereco: Endereco) {
        setForm({
            tipoEndereco: TIPOS_ENDERECO.includes(
                endereco.tipoEndereco as TipoEndereco
            )
                ? endereco.tipoEndereco as TipoEndereco
                : 'OUTRO',
            cep: endereco.cep ?? '',
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            complemento: endereco.complemento ?? '',
            bairro: endereco.bairro ?? '',
            idMunicipio: ''
        });
        setAlterandoMunicipio(false);
        setLocalidadeCep(null);
        setErro(null);
        setOperacao({ tipo: 'editar', endereco });
    }

    async function salvar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (!operacao) return;

        if (
            (operacao.tipo === 'novo' || alterandoMunicipio)
            && !form.idMunicipio
        ) {
            setErro('Selecione um município da lista.');
            return;
        }

        const dados: DadosFormularioEndereco = {
            tipoEndereco: form.tipoEndereco,
            cep: form.cep.replace(/\D/g, ''),
            logradouro: form.logradouro,
            numero: form.numero,
            complemento: form.complemento,
            bairro: form.bairro,
            idMunicipio: form.idMunicipio
                ? Number(form.idMunicipio)
                : undefined
        };

        setProcessando(true);
        setErro(null);
        try {
            if (operacao.tipo === 'novo') {
                await onAdicionar({
                    ...dados,
                    idMunicipio: Number(form.idMunicipio)
                });
            } else {
                await onEditar(operacao.endereco.idEndereco, dados);
            }
            setOperacao(null);
        } catch (causa) {
            setErro(
                causa instanceof Error
                    ? causa.message
                    : 'Erro ao salvar endereço.'
            );
        } finally {
            setProcessando(false);
        }
    }

    async function confirmarExclusao() {
        if (idExcluir === null) return;

        setProcessando(true);
        setErro(null);
        try {
            await onExcluir(idExcluir);
            setIdExcluir(null);
        } catch (causa) {
            setErro(
                causa instanceof Error
                    ? causa.message
                    : 'Erro ao excluir endereço.'
            );
        } finally {
            setProcessando(false);
        }
    }

    return (
        <section className="rounded-md border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2 text-purple-600">
                    <MapPin className="h-5 w-5" />
                    <h3 className="font-medium">Endereços</h3>
                </div>
                {!operacao && (
                    <button
                        type="button"
                        onClick={abrirNovo}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar
                    </button>
                )}
            </div>

            {operacao && (
                <form
                    onSubmit={salvar}
                    className="mb-4 grid grid-cols-1 gap-3 rounded-md bg-gray-50 p-3 md:grid-cols-2"
                >
                    <Campo label="Tipo de endereço" obrigatorio>
                        <select
                            required
                            value={form.tipoEndereco}
                            onChange={(evento) => alterar(
                                'tipoEndereco',
                                evento.target.value
                            )}
                            className={classeCampo}
                        >
                            {TIPOS_ENDERECO.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo === 'OUTRO'
                                        ? 'Outro'
                                        : tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </Campo>
                    <CampoCep
                        value={form.cep}
                        onChange={(cep) => alterar('cep', cep)}
                        onEnderecoEncontrado={preencherEnderecoPorCep}
                        classeCampo={classeCampo}
                    />
                    <Campo label="Logradouro" obrigatorio>
                        <input
                            required
                            maxLength={255}
                            value={form.logradouro}
                            onChange={(evento) => alterar('logradouro', evento.target.value)}
                            className={classeCampo}
                        />
                    </Campo>
                    <Campo label="Número" obrigatorio>
                        <input
                            required
                            maxLength={20}
                            value={form.numero}
                            onChange={(evento) => alterar('numero', evento.target.value)}
                            className={classeCampo}
                        />
                    </Campo>
                    <Campo label="Bairro">
                        <input
                            maxLength={100}
                            value={form.bairro}
                            onChange={(evento) => alterar('bairro', evento.target.value)}
                            className={classeCampo}
                        />
                    </Campo>
                    <Campo label="Complemento">
                        <input
                            maxLength={255}
                            value={form.complemento}
                            onChange={(evento) => alterar('complemento', evento.target.value)}
                            className={classeCampo}
                        />
                    </Campo>

                    {operacao.tipo === 'editar' && !alterandoMunicipio ? (
                        <div className="rounded-md border border-gray-200 bg-white p-3 md:col-span-2">
                            <span className="block text-sm font-medium text-gray-700">
                                Município atual
                            </span>
                            <span className="text-sm text-gray-600">
                                {operacao.endereco.cidade}/{operacao.endereco.estado}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    setAlterandoMunicipio(true);
                                    alterarMunicipio('');
                                }}
                                className="ml-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                Alterar município
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 md:col-span-2 md:grid-cols-2">
                            <SeletorMunicipio
                                key={
                                    localidadeCep?.chave
                                    ?? (operacao.tipo === 'editar'
                                        ? `editar-${operacao.endereco.idEndereco}`
                                        : 'novo-endereco')
                                }
                                idMunicipio={form.idMunicipio}
                                onChange={alterarMunicipio}
                                classeCampo={classeCampo}
                                ufSugerida={localidadeCep?.uf}
                                municipioSugerido={localidadeCep?.municipio}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 md:col-span-2">
                        <button
                            type="button"
                            disabled={processando}
                            onClick={() => setOperacao(null)}
                            className="inline-flex items-center gap-1 rounded-md border bg-white px-3 py-1.5 text-sm text-gray-600"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processando}
                            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                        >
                            {processando
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <Save className="h-4 w-4" />}
                            Salvar
                        </button>
                    </div>
                </form>
            )}

            {enderecos.length > 0 ? (
                <div className="space-y-3">
                    {enderecos.map((endereco) => (
                        <div
                            key={endereco.idEndereco}
                            className="flex items-start justify-between gap-3 rounded-md border bg-gray-50 p-3 text-sm text-gray-700"
                        >
                            <div>
                                <div className="mb-1 font-medium text-gray-800">
                                    {endereco.tipoEndereco}
                                </div>
                                <div>
                                    {endereco.logradouro}, {endereco.numero}
                                    {endereco.complemento && ` - ${endereco.complemento}`}
                                </div>
                                <div>
                                    {endereco.bairro && `${endereco.bairro} - `}
                                    {endereco.cidade}/{endereco.estado}
                                    {endereco.cep && ` - ${endereco.cep}`}
                                </div>
                                <div>{endereco.pais}</div>
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <button
                                    type="button"
                                    disabled={processando}
                                    onClick={() => abrirEdicao(endereco)}
                                    className="rounded p-1 text-blue-600 hover:bg-blue-50"
                                    aria-label="Editar endereço"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    disabled={processando}
                                    onClick={() => setIdExcluir(endereco.idEndereco)}
                                    className="rounded p-1 text-red-600 hover:bg-red-50"
                                    aria-label="Excluir endereço"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="text-sm text-gray-400">
                    Nenhum endereço cadastrado.
                </span>
            )}

            {idExcluir !== null && (
                <ConfirmacaoExclusao
                    mensagem="Confirma a exclusão deste endereço? Esta ação não pode ser desfeita."
                    processando={processando}
                    onCancelar={() => setIdExcluir(null)}
                    onConfirmar={() => void confirmarExclusao()}
                />
            )}

            {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}
        </section>
    );
}

function Campo({
    label,
    obrigatorio,
    children
}: {
    label: string;
    obrigatorio?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label className="block text-sm font-medium text-gray-700">
            <span className="mb-1 block">
                {label}{obrigatorio ? ' *' : ''}
            </span>
            {children}
        </label>
    );
}
