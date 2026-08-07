'use client'

import { FormEvent, useState } from 'react';
import {
    Loader2,
    Mail,
    Pencil,
    Phone,
    Plus,
    Save,
    Trash2,
    X
} from 'lucide-react';
import ConfirmacaoExclusao from './ConfirmacaoExclusao';

export interface ContatoEditavel {
    id: number;
    valor: string;
    tipo: string;
}

interface GerenciadorContatosProps {
    variante: 'email' | 'telefone';
    contatos: ContatoEditavel[];
    tiposPermitidos: readonly string[];
    onAdicionar: (valor: string, tipo: string) => Promise<void>;
    onEditar: (id: number, valor: string, tipo: string) => Promise<void>;
    onExcluir: (id: number) => Promise<void>;
    somenteLeitura?: boolean;
}

type Operacao =
    | { tipo: 'novo' }
    | { tipo: 'editar'; contato: ContatoEditavel }
    | null;

const labelsTipos: Record<string, string> = {
    PESSOAL: 'Pessoal',
    RESIDENCIAL: 'Residencial',
    COMERCIAL: 'Comercial',
    CELULAR: 'Celular',
    OUTROS: 'Outros'
};

export default function GerenciadorContatos({
    variante,
    contatos,
    tiposPermitidos,
    onAdicionar,
    onEditar,
    onExcluir,
    somenteLeitura = false
}: GerenciadorContatosProps) {
    const [operacao, setOperacao] = useState<Operacao>(null);
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState(tiposPermitidos[0] ?? 'OUTROS');
    const [idExcluir, setIdExcluir] = useState<number | null>(null);
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const ehEmail = variante === 'email';
    const Icone = ehEmail ? Mail : Phone;
    const titulo = ehEmail ? 'E-mails' : 'Telefones';
    const nomeSingular = ehEmail ? 'e-mail' : 'telefone';

    function abrirNovo() {
        setValor('');
        setTipo(tiposPermitidos[0] ?? 'OUTROS');
        setErro(null);
        setOperacao({ tipo: 'novo' });
    }

    function abrirEdicao(contato: ContatoEditavel) {
        setValor(contato.valor);
        setTipo(
            tiposPermitidos.includes(contato.tipo)
                ? contato.tipo
                : 'OUTROS'
        );
        setErro(null);
        setOperacao({ tipo: 'editar', contato });
    }

    async function salvar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (!operacao) return;

        setProcessando(true);
        setErro(null);
        try {
            if (operacao.tipo === 'novo') {
                await onAdicionar(valor, tipo);
            } else {
                await onEditar(operacao.contato.id, valor, tipo);
            }
            setOperacao(null);
        } catch (causa) {
            setErro(
                causa instanceof Error
                    ? causa.message
                    : `Erro ao salvar ${nomeSingular}.`
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
                    : `Erro ao excluir ${nomeSingular}.`
            );
        } finally {
            setProcessando(false);
        }
    }

    return (
        <section className="rounded-md border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between border-b pb-2">
                <div className={`flex items-center gap-2 ${ehEmail ? 'text-orange-600' : 'text-green-600'}`}>
                    <Icone className="h-5 w-5" />
                    <h3 className="font-medium">{titulo}</h3>
                </div>
                {!somenteLeitura && !operacao && (
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
                <form onSubmit={salvar} className="mb-4 space-y-3 rounded-md bg-gray-50 p-3">
                    <label className="block text-sm font-medium text-gray-700">
                        <span className="mb-1 block">{ehEmail ? 'E-mail' : 'Telefone'} *</span>
                        <input
                            type={ehEmail ? 'email' : 'tel'}
                            required
                            maxLength={ehEmail ? 256 : 20}
                            value={valor}
                            onChange={(evento) => setValor(evento.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        />
                    </label>
                    <label className="block text-sm font-medium text-gray-700">
                        <span className="mb-1 block">Tipo *</span>
                        <select
                            required
                            value={tipo}
                            onChange={(evento) => setTipo(evento.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        >
                            {tiposPermitidos.map((opcao) => (
                                <option key={opcao} value={opcao}>
                                    {labelsTipos[opcao] ?? opcao}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            disabled={processando}
                            onClick={() => setOperacao(null)}
                            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm text-gray-600 hover:bg-white"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processando}
                            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processando
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <Save className="h-4 w-4" />}
                            Salvar
                        </button>
                    </div>
                </form>
            )}

            {contatos.length > 0 ? (
                <ul className="space-y-2">
                    {contatos.map((contato) => (
                        <li
                            key={contato.id}
                            className="flex items-center justify-between gap-3 rounded-md border border-gray-100 p-2 text-sm"
                        >
                            <div className="min-w-0">
                                <span className="mr-2 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                    {labelsTipos[contato.tipo] ?? contato.tipo}
                                </span>
                                <span className="break-all text-gray-700">{contato.valor}</span>
                            </div>
                            {!somenteLeitura && (
                                <div className="flex shrink-0 gap-1">
                                    <button
                                        type="button"
                                        disabled={processando}
                                        onClick={() => abrirEdicao(contato)}
                                        className="rounded p-1 text-blue-600 hover:bg-blue-50"
                                        aria-label={`Editar ${nomeSingular}`}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={processando}
                                        onClick={() => setIdExcluir(contato.id)}
                                        className="rounded p-1 text-red-600 hover:bg-red-50"
                                        aria-label={`Excluir ${nomeSingular}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <span className="text-sm text-gray-400">
                    Nenhum {nomeSingular} cadastrado.
                </span>
            )}

            {idExcluir !== null && (
                <ConfirmacaoExclusao
                    mensagem={`Confirma a exclusão deste ${nomeSingular}? Esta ação não pode ser desfeita.`}
                    processando={processando}
                    onCancelar={() => setIdExcluir(null)}
                    onConfirmar={() => void confirmarExclusao()}
                />
            )}

            {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}
        </section>
    );
}
