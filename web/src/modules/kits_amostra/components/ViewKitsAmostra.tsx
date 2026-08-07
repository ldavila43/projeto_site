'use client'

import { useContext, useState } from 'react';
import { Pencil, Plus, Send, Trash2 } from 'lucide-react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosKitsAmostra } from '../kitsAmostraActions';
import {
    KitAmostra,
    ResponseGetKits,
    RequestGetKits,
    STATUS_KITS
} from '../KitsAmostraDTO';
import ModalNovoKitAmostra from './ModalNovoKitAmostra';
import { formatarValorEnum } from '@/src/shared/utils/StatusEnum';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import FormEditarKitAmostra from './FormEditarKitAmostra';
import FormExcluirKitAmostra from './FormExcluirKitAmostra';
import { AuthContext } from '@/src/shared/AuthContext';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import FormCadastroEnvio from '@/src/modules/envios/components/FormCadastroEnvio';
import SeletorPessoa from '@/src/modules/pessoas/components/SeletorPessoa';
import { formatarData } from '@/src/shared/utils/formatarData';

type OperacaoKit =
    | { tipo: 'editar'; kit: KitAmostra }
    | { tipo: 'excluir'; kit: KitAmostra }
    | null;

const camposFiltro: CampoFiltroConfig<RequestGetKits>[] = [
    { tipo: 'texto', name: 'codBgk', label: 'Código BGK' },
    { tipo: 'texto', name: 'codLote', label: 'Lote' },
    { tipo: 'texto', name: 'codigoBarras', label: 'Código de Barras' },
    { tipo: 'texto', name: 'tipoKit', label: 'Tipo de Kit' },
    {
        tipo: 'select',
        name: 'status',
        label: 'Status',
        opcoes: [
            { value: '', label: 'Todos' },
            ...STATUS_KITS.map((status) => ({
                value: status,
                label: formatarValorEnum(status)
            }))
        ]
    },
    { tipo: 'data', name: 'dataAtivacaoIni', label: 'Ativação Inicial' },
    { tipo: 'data', name: 'dataAtivacaoFim', label: 'Ativação Final' },
    { tipo: 'data', name: 'dataValidadeIni', label: 'Validade Inicial' },
    { tipo: 'data', name: 'dataValidadeFim', label: 'Validade Final' }
];

const colunasBase: ColunaTabela<KitAmostra>[] = [
    { chave: 'codBgk', titulo: 'Cód. BGK', className: 'font-medium text-gray-800' },
    { chave: 'codLote', titulo: 'Lote', render: (kit) => kit.codLote || '-' },
    { chave: 'codigoBarras', titulo: 'Cód. Barras', render: (kit) => kit.codigoBarras || '-' },
    { chave: 'tipoKit', titulo: 'Tipo do Kit' },
    { chave: 'responsavel', titulo: 'Responsável', render: (kit) => kit.responsavel || '-' },
    {
        chave: 'dataAtivacao',
        titulo: 'Ativação',
        render: (kit) => formatarData(kit.dataAtivacao)
    },
    {
        chave: 'dataValidade',
        titulo: 'Validade',
        render: (kit) => formatarData(kit.dataValidade)
    },
    {
        chave: 'status',
        titulo: 'Status',
        render: (kit) => (
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                kit.status === 'ATIVO'
                    ? 'bg-green-100 text-green-800'
                    : kit.status === 'DESCARTADO' || kit.status === 'INVÁLIDO'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
            }`}>
                {kit.status}
            </span>
        )
    }
];

export default function ViewKitsAmostra({
    dadosIni
}: {
    dadosIni: ResponseGetKits;
}) {
    const contexto = useContext(AuthContext);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalEnvioAberto, setModalEnvioAberto] = useState(false);
    const [operacao, setOperacao] = useState<OperacaoKit>(null);
    const [versaoFiltroResponsavel, setVersaoFiltroResponsavel] = useState(0);
    const [kitsSelecionados, setKitsSelecionados] = useState<Map<number, KitAmostra>>(
        () => new Map()
    );

    const listagem = useListagem<RequestGetKits, ResponseGetKits, KitAmostra>({
        funcao: buscarDadosKitsAmostra,
        filtrosIniciais: {
            codBgk: '',
            codLote: '',
            codigoBarras: '',
            idResponsavel: '',
            tipoKit: '',
            status: '',
            dataAtivacaoIni: '',
            dataAtivacaoFim: '',
            dataValidadeIni: '',
            dataValidadeFim: '',
            limit: '10',
            page: '1'
        },
        obterItens: (resposta) => resposta.kitsAmostra,
        obterMetadados: (resposta) => resposta.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: [
            'codBgk',
            'codLote',
            'codigoBarras',
            'idResponsavel',
            'tipoKit',
            'status',
            'dataAtivacaoIni',
            'dataAtivacaoFim',
            'dataValidadeIni',
            'dataValidadeFim'
        ]
    });

    function selecionarKit(kit: KitAmostra, selecionado: boolean) {
        setKitsSelecionados((anteriores) => {
            const atualizados = new Map(anteriores);
            if (selecionado) {
                atualizados.set(kit.idKit, kit);
            } else {
                atualizados.delete(kit.idKit);
            }
            return atualizados;
        });
    }

    const colunas: ColunaTabela<KitAmostra>[] = [
        {
            chave: 'selecao',
            titulo: 'Enviar',
            render: (kit) => kit.disponivelParaEnvio ? (
                <input
                    type="checkbox"
                    checked={kitsSelecionados.has(kit.idKit)}
                    onChange={(evento) => selecionarKit(kit, evento.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    aria-label={`Selecionar kit ${kit.codBgk} para envio`}
                />
            ) : '-'
        },
        ...colunasBase
    ];

    function handleSucesso() {
        setModalAberto(false);
        setOperacao(null);
        setKitsSelecionados(new Map());
        void listagem.recarregar();
    }

    function handleEnvioCadastrado(mensagem: string) {
        setModalEnvioAberto(false);
        setKitsSelecionados(new Map());
        alert(mensagem);
        void listagem.recarregar();
    }

    const kitsParaEnvio = Array.from(kitsSelecionados.values());

    return (
        <div>
            <TemplateListagem
                titulo="Kits de Amostra"
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(kit) => kit.idKit}
                dados={listagem.dados}
                metadados={listagem.metadados}
                carregando={listagem.carregando}
                erro={listagem.erro}
                filtros={listagem.filtros}
                filtrosExtras={(
                    <div className="md:col-span-2">
                        <SeletorPessoa
                            key={versaoFiltroResponsavel}
                            label="Responsável"
                            value={listagem.filtros.idResponsavel ?? ''}
                            onChange={(idPessoa) => listagem.alterarFiltro(
                                'idResponsavel',
                                idPessoa
                            )}
                        />
                    </div>
                )}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onLimparFiltros={() => {
                    listagem.handleLimparFiltros();
                    setVersaoFiltroResponsavel((versao) => versao + 1);
                }}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                acoesHeader={[
                    ...(kitsSelecionados.size > 0
                        ? [{
                            label: `Enviar (${kitsSelecionados.size})`,
                            icone: Send,
                            onClick: () => setModalEnvioAberto(true)
                        }]
                        : []),
                    {
                        label: 'Novo Kit',
                        icone: Plus,
                        onClick: () => setModalAberto(true)
                    }
                ]}
                acoesExtra={(kit) => (
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setOperacao({ tipo: 'editar', kit })}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                            title="Editar kit"
                            aria-label={`Editar kit ${kit.codBgk}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        {contexto?.perfilAtivo === PERFIS.ADMINISTRADOR && (
                            <button
                                type="button"
                                onClick={() => setOperacao({ tipo: 'excluir', kit })}
                                className="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-800"
                                title="Excluir kit"
                                aria-label={`Excluir kit ${kit.codBgk}`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
                mensagemVazio="Nenhum kit encontrado."
            />

            <ModalNovoKitAmostra
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                onSucesso={handleSucesso}
            />

            <ModalFormulario
                aberto={modalEnvioAberto}
                titulo="Cadastrar envio de kits"
                onClose={() => setModalEnvioAberto(false)}
            >
                <FormCadastroEnvio
                    kits={kitsParaEnvio}
                    onSucesso={handleEnvioCadastrado}
                />
            </ModalFormulario>

            {operacao?.tipo === 'editar' && (
                <ModalFormulario
                    aberto
                    titulo={`Editar kit ${operacao.kit.codBgk}`}
                    onClose={() => setOperacao(null)}
                >
                    <FormEditarKitAmostra
                        key={operacao.kit.idKit}
                        kit={operacao.kit}
                        onSucesso={handleSucesso}
                    />
                </ModalFormulario>
            )}

            {operacao?.tipo === 'excluir' && (
                <ModalFormulario
                    aberto
                    titulo={`Excluir kit ${operacao.kit.codBgk}`}
                    onClose={() => setOperacao(null)}
                    largura="md"
                >
                    <FormExcluirKitAmostra
                        key={operacao.kit.idKit}
                        kit={operacao.kit}
                        onCancelar={() => setOperacao(null)}
                        onSucesso={handleSucesso}
                    />
                </ModalFormulario>
            )}
        </div>
    );
}
