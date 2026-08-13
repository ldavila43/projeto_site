'use client'

import { FormEvent, useEffect, useState } from 'react';
import { FlaskConical, Loader2, Save } from 'lucide-react';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import { formatarValorEnum } from '@/src/shared/utils/StatusEnum';
import {
    buscarOpcoesAmostraSolicitacao,
    criarAmostraSolicitacao
} from '../solicitacoesActions';
import type {
    OpcaoAmostraSolicitacao,
    ResponseOpcoesAmostraSolicitacao,
    SolicitacoesExame
} from '../SolicitacaoDTO';

interface ModalCriarAmostraSolicitacaoProps {
    solicitacao: SolicitacoesExame;
    onClose: () => void;
    onSucesso: (mensagem: string) => void;
}

const classeCampo = 'w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100';

function dataHoraParaIso(valor: string): string {
    return new Date(valor).toISOString();
}

export default function ModalCriarAmostraSolicitacao({
    solicitacao,
    onClose,
    onSucesso
}: ModalCriarAmostraSolicitacaoProps) {
    const [opcoes, setOpcoes] = useState<ResponseOpcoesAmostraSolicitacao | null>(null);
    const [idTipoAmostra, setIdTipoAmostra] = useState<number | null>(null);
    const [idKit, setIdKit] = useState<number | null>(null);
    const [observacoes, setObservacoes] = useState('');
    const [flagPesquisa, setFlagPesquisa] = useState(true);
    const [dataColeta, setDataColeta] = useState('');
    const [dataRecebimento, setDataRecebimento] = useState('');
    const [identificacaoDosTubos, setIdentificacaoDosTubos] = useState('');
    const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let ativo = true;

        async function carregarOpcoes() {
            setCarregandoOpcoes(true);
            setErro(null);
            try {
                const resposta = await buscarOpcoesAmostraSolicitacao(
                    solicitacao.idSolicitacao
                );
                if (ativo) setOpcoes(resposta);
            } catch (causa) {
                if (!ativo) return;
                setErro(
                    causa instanceof Error
                        ? causa.message
                        : 'Não foi possível buscar as opções de amostra.'
                );
            } finally {
                if (ativo) setCarregandoOpcoes(false);
            }
        }

        void carregarOpcoes();
        return () => {
            ativo = false;
        };
    }, [solicitacao.idSolicitacao]);

    const opcaoSelecionada: OpcaoAmostraSolicitacao | undefined =
        opcoes?.opcoes.find((opcao) => opcao.idTipoAmostra === idTipoAmostra);

    function selecionarTipo(valor: string) {
        const id = valor ? Number(valor) : null;
        setIdTipoAmostra(id);
        setIdKit(null);
        setErro(null);
    }

    async function enviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErro(null);

        if (!opcoes?.podeCriarAmostra || !opcaoSelecionada?.elegivelParaCriacao) {
            setErro('Selecione uma opção de amostra elegível.');
            return;
        }
        if (!dataColeta) {
            setErro('Informe a data da coleta.');
            return;
        }

        setSalvando(true);
        try {
            const resultado = await criarAmostraSolicitacao(
                solicitacao.idSolicitacao,
                {
                    idTipoAmostra: opcaoSelecionada.idTipoAmostra,
                    flagRecoleta: opcaoSelecionada.flagRecoletaObrigatoria,
                    flagPesquisa,
                    dataColeta: dataHoraParaIso(dataColeta),
                    ...(idKit !== null && { idKit }),
                    ...(observacoes.trim() && {
                        observacoes: observacoes.trim()
                    }),
                    ...(dataRecebimento && {
                        dataRecebimento: dataHoraParaIso(dataRecebimento)
                    }),
                    ...(identificacaoDosTubos.trim() && {
                        identificacaoDosTubos: identificacaoDosTubos.trim()
                    })
                }
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
                    : 'Não foi possível criar a amostra.'
            );
        } finally {
            setSalvando(false);
        }
    }

    const criacaoDisponivel = Boolean(
        opcoes?.podeCriarAmostra && opcaoSelecionada?.elegivelParaCriacao
    );

    return (
        <ModalFormulario
            aberto
            titulo="Criar amostra da solicitação"
            onClose={onClose}
            largura="lg"
        >
            <form onSubmit={enviar} className="space-y-5">
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
                    <p className="flex items-center gap-2 font-semibold">
                        <FlaskConical className="h-4 w-4" />
                        Solicitação {solicitacao.protocolo || `#${solicitacao.idSolicitacao}`}
                    </p>
                    <p className="mt-1">Paciente: {solicitacao.nomePaciente}</p>
                    <p className="mt-1">
                        Amostras pendentes informadas pela listagem:{' '}
                        <strong>{solicitacao.amostrasPendentes}</strong>
                    </p>
                </div>

                {carregandoOpcoes ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-600">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Buscando opções de amostra...
                    </div>
                ) : (
                    <>
                        {opcoes && !opcoes.podeCriarAmostra && (
                            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                <p className="font-semibold">Criação indisponível</p>
                                {opcoes.motivosInelegibilidade.length > 0 && (
                                    <ul className="mt-2 list-disc space-y-1 pl-5">
                                        {opcoes.motivosInelegibilidade.map((motivo) => (
                                            <li key={motivo}>{motivo}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        <p className="text-sm text-gray-600">
                            Campos marcados com <strong>*</strong> são obrigatórios.
                        </p>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="amostra-tipo"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Tipo de amostra *
                                </label>
                                <select
                                    id="amostra-tipo"
                                    required
                                    value={idTipoAmostra ?? ''}
                                    onChange={(evento) => selecionarTipo(evento.target.value)}
                                    disabled={!opcoes?.podeCriarAmostra}
                                    className={classeCampo}
                                >
                                    <option value="">Selecione...</option>
                                    {opcoes?.opcoes.map((opcao) => (
                                        <option
                                            key={opcao.idTipoAmostra}
                                            value={opcao.idTipoAmostra}
                                            disabled={!opcao.elegivelParaCriacao}
                                        >
                                            {opcao.descricao} — {formatarValorEnum(opcao.situacao)}
                                            {!opcao.elegivelParaCriacao ? ' (indisponível)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="amostra-kit"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Kit vinculado
                                </label>
                                <select
                                    id="amostra-kit"
                                    value={idKit ?? ''}
                                    onChange={(evento) => setIdKit(
                                        evento.target.value
                                            ? Number(evento.target.value)
                                            : null
                                    )}
                                    disabled={!opcaoSelecionada?.elegivelParaCriacao}
                                    className={classeCampo}
                                >
                                    <option value="">Sem kit</option>
                                    {opcaoSelecionada?.kits.map((kit) => (
                                        <option
                                            key={kit.idKit}
                                            value={kit.idKit}
                                            disabled={!kit.elegivelParaUso}
                                        >
                                            {kit.codBgk} — Tipo de amostra:{' '}
                                            {opcaoSelecionada.descricao}{' '}
                                            (#{opcaoSelecionada.idTipoAmostra}) —{' '}
                                            {formatarValorEnum(kit.status)}
                                            {!kit.elegivelParaUso ? ' (indisponível)' : ''}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    O vínculo com kit é opcional.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="amostra-data-coleta"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Data da coleta *
                                </label>
                                <input
                                    id="amostra-data-coleta"
                                    type="datetime-local"
                                    required
                                    value={dataColeta}
                                    onChange={(evento) => setDataColeta(evento.target.value)}
                                    disabled={!criacaoDisponivel}
                                    className={classeCampo}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="amostra-data-recebimento"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Data de recebimento
                                </label>
                                <input
                                    id="amostra-data-recebimento"
                                    type="datetime-local"
                                    value={dataRecebimento}
                                    onChange={(evento) => setDataRecebimento(evento.target.value)}
                                    disabled={!criacaoDisponivel}
                                    className={classeCampo}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="amostra-identificacao-tubos"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Identificação dos tubos
                                </label>
                                <input
                                    id="amostra-identificacao-tubos"
                                    type="text"
                                    value={identificacaoDosTubos}
                                    onChange={(evento) => setIdentificacaoDosTubos(evento.target.value)}
                                    disabled={!criacaoDisponivel}
                                    className={classeCampo}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="amostra-observacoes"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Observações
                                </label>
                                <textarea
                                    id="amostra-observacoes"
                                    rows={3}
                                    value={observacoes}
                                    onChange={(evento) => setObservacoes(evento.target.value)}
                                    disabled={!criacaoDisponivel}
                                    className={classeCampo}
                                />
                            </div>
                        </div>

                        {opcaoSelecionada && (
                            <div className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 bg-white p-4 md:grid-cols-2">
                                <div className="text-sm text-gray-700">
                                    <strong className="block">Modalidade da coleta</strong>
                                    {opcaoSelecionada.flagRecoletaObrigatoria
                                        ? 'Recoleta obrigatória'
                                        : 'Nova coleta'}
                                </div>

                                <label className="flex items-start gap-3 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={flagPesquisa}
                                        onChange={(evento) => setFlagPesquisa(evento.target.checked)}
                                        disabled={!criacaoDisponivel}
                                        className="mt-0.5 h-4 w-4 rounded border-gray-300"
                                    />
                                    <span>
                                        <strong className="block">Amostra para pesquisa</strong>
                                        Envia a flag de pesquisa no cadastro.
                                    </span>
                                </label>
                            </div>
                        )}

                        {opcaoSelecionada?.motivosInelegibilidade.length ? (
                            <ul className="list-disc rounded-md border border-amber-200 bg-amber-50 p-4 pl-9 text-sm text-amber-900">
                                {opcaoSelecionada.motivosInelegibilidade.map((motivo) => (
                                    <li key={motivo}>{motivo}</li>
                                ))}
                            </ul>
                        ) : null}
                    </>
                )}

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
                        disabled={carregandoOpcoes || salvando || !criacaoDisponivel}
                        className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {salvando ? 'Criando...' : 'Criar amostra'}
                    </button>
                </div>
            </form>
        </ModalFormulario>
    );
}
