'use client'

import { useContext, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AuthContext } from '@/src/shared/AuthContext';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import { buscarTiposEnvio } from '../tiposEnvioActions';
import {
    RequestGetTiposEnvio,
    ResponseGetTiposEnvio,
    TipoEnvio
} from '../tiposEnvioDTO';
import ConfirmarExclusaoTipoEnvio from './ConfirmarExclusaoTipoEnvio';
import FormTipoEnvio from './FormTipoEnvio';

type OperacaoTipoEnvio =
    | { tipo: 'novo' }
    | { tipo: 'editar'; item: TipoEnvio }
    | { tipo: 'excluir'; item: TipoEnvio }
    | null;

const colunas: ColunaTabela<TipoEnvio>[] = [
    {
        chave: 'idTipoEnvio',
        titulo: 'ID',
        className: 'w-20 text-gray-500'
    },
    {
        chave: 'descricao',
        titulo: 'Descrição',
        className: 'font-medium text-gray-800'
    }
];

const camposFiltro: CampoFiltroConfig<RequestGetTiposEnvio>[] = [
    {
        tipo: 'texto',
        name: 'descricao',
        label: 'Descrição',
        placeholder: 'Buscar tipo de envio'
    }
];

export default function ViewTiposEnvio({
    dadosIniciais
}: {
    dadosIniciais: ResponseGetTiposEnvio;
}) {
    const contexto = useContext(AuthContext);
    const [operacao, setOperacao] = useState<OperacaoTipoEnvio>(null);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const podeGerenciar = contexto?.perfilAtivo === PERFIS.ADMINISTRADOR
        || contexto?.perfilAtivo === PERFIS.COLABORADOR;

    const listagem = useListagem<
        RequestGetTiposEnvio,
        ResponseGetTiposEnvio,
        TipoEnvio
    >({
        funcao: buscarTiposEnvio,
        filtrosIniciais: {
            descricao: '',
            page: '1',
            limit: '10'
        },
        obterItens: (resposta) => resposta.dados,
        obterMetadados: (resposta) => resposta.metadados,
        initialDados: dadosIniciais,
        autoBuscar: true,
        camposAutoBusca: ['descricao']
    });

    function concluir(mensagemSucesso: string) {
        setMensagem(mensagemSucesso);
        setOperacao(null);
        void listagem.recarregar();
    }

    return (
        <div className="space-y-4">
            {mensagem && (
                <div
                    role="status"
                    className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                >
                    {mensagem}
                </div>
            )}

            <TemplateListagem
                titulo="Tipos de Envio"
                dados={listagem.dados}
                metadados={listagem.metadados}
                carregando={listagem.carregando}
                erro={listagem.erro}
                filtros={listagem.filtros}
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(item) => item.idTipoEnvio}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onLimparFiltros={listagem.handleLimparFiltros}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                acaoHeader={podeGerenciar
                    ? {
                        label: 'Novo Tipo de Envio',
                        icone: Plus,
                        onClick: () => setOperacao({ tipo: 'novo' })
                    }
                    : undefined}
                acoesExtra={podeGerenciar
                    ? (item) => (
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setOperacao({ tipo: 'editar', item })}
                                className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                                aria-label={`Editar ${item.descricao}`}
                                title="Editar tipo de envio"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setOperacao({ tipo: 'excluir', item })}
                                className="rounded p-1.5 text-red-600 hover:bg-red-50"
                                aria-label={`Excluir ${item.descricao}`}
                                title="Excluir tipo de envio"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    )
                    : undefined}
                mensagemVazio="Nenhum tipo de envio encontrado."
            />

            {(operacao?.tipo === 'novo' || operacao?.tipo === 'editar') && (
                <ModalFormulario
                    aberto
                    titulo={operacao.tipo === 'novo'
                        ? 'Novo Tipo de Envio'
                        : `Editar ${operacao.item.descricao}`}
                    onClose={() => setOperacao(null)}
                    largura="md"
                >
                    <FormTipoEnvio
                        tipoEnvio={operacao.tipo === 'editar'
                            ? operacao.item
                            : undefined}
                        onSucesso={concluir}
                    />
                </ModalFormulario>
            )}

            {operacao?.tipo === 'excluir' && (
                <ModalFormulario
                    aberto
                    titulo="Excluir Tipo de Envio"
                    onClose={() => setOperacao(null)}
                    largura="md"
                >
                    <ConfirmarExclusaoTipoEnvio
                        tipoEnvio={operacao.item}
                        onCancelar={() => setOperacao(null)}
                        onSucesso={concluir}
                    />
                </ModalFormulario>
            )}
        </div>
    );
}
