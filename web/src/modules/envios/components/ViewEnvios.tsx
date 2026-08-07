'use client'

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import {
    formatarValorEnum,
    STATUS_ENVIOS
} from '@/src/shared/utils/StatusEnum';
import { formatarData } from '@/src/shared/utils/formatarData';
import { buscarEnvios } from '../enviosActions';
import {
    Envio,
    RequestGetEnvios,
    ResponseGetEnvios
} from '../enviosDTO';
import ConfirmarExclusaoEnvio from './ConfirmarExclusaoEnvio';
import FormEditarEnvio from './FormEditarEnvio';

const colunas: ColunaTabela<Envio>[] = [
    { chave: 'idEnvio', titulo: 'ID', className: 'w-16 text-gray-500' },
    {
        chave: 'itensEnviados',
        titulo: 'Kits',
        render: (envio) => Array.isArray(envio.itensEnviados)
            ? envio.itensEnviados.map((kit) => kit.codBgk).join(', ') || '-'
            : '-'
    },
    {
        chave: 'numeroItens',
        titulo: 'Itens',
        className: 'text-center'
    },
    {
        chave: 'nomeDestinatario',
        titulo: 'Destinatário',
        className: 'font-medium text-gray-800'
    },
    {
        chave: 'categoriaEnvio',
        titulo: 'Categoria',
        render: (envio) => formatarValorEnum(envio.categoriaEnvio)
    },
    {
        chave: 'status',
        titulo: 'Status',
        render: (envio) => (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                envio.status === 'ENTREGUE'
                    ? 'bg-green-100 text-green-800'
                    : envio.status === 'EXTRAVIADO'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
            }`}>
                {formatarValorEnum(envio.status)}
            </span>
        )
    },
    {
        chave: 'dataEnvio',
        titulo: 'Envio',
        render: (envio) => formatarData(envio.dataEnvio)
    },
    {
        chave: 'dataPrazoPostagem',
        titulo: 'Prazo de postagem',
        render: (envio) => formatarData(envio.dataPrazoPostagem)
    },
    {
        chave: 'dataChegada',
        titulo: 'Chegada',
        render: (envio) => formatarData(envio.dataChegada)
    },
    {
        chave: 'codRastreio',
        titulo: 'Rastreio',
        render: (envio) => envio.codRastreio || '-'
    }
];

const camposFiltro: CampoFiltroConfig<RequestGetEnvios>[] = [
    { tipo: 'texto', name: 'codBgk', label: 'Código BGK' },
    { tipo: 'texto', name: 'destinatario', label: 'Destinatário' },
    { tipo: 'texto', name: 'idTipoEnvio', label: 'ID do Tipo de Envio' },
    { tipo: 'texto', name: 'codRastreio', label: 'Código de Rastreio' },
    {
        tipo: 'select',
        name: 'status',
        label: 'Status',
        opcoes: [
            { value: '', label: 'Todos' },
            ...STATUS_ENVIOS.map((status) => ({
                value: status,
                label: formatarValorEnum(status)
            }))
        ]
    },
    { tipo: 'data', name: 'dataEnvioIni', label: 'Envio Inicial' },
    { tipo: 'data', name: 'dataEnvioFim', label: 'Envio Final' },
    { tipo: 'data', name: 'dataChegadaIni', label: 'Chegada Inicial' },
    { tipo: 'data', name: 'dataChegadaFim', label: 'Chegada Final' },
    {
        tipo: 'data',
        name: 'dataPrazoPostagemIni',
        label: 'Prazo de Postagem Inicial'
    },
    {
        tipo: 'data',
        name: 'dataPrazoPostagemFim',
        label: 'Prazo de Postagem Final'
    }
];

export default function ViewEnvios({
    dadosIniciais
}: {
    dadosIniciais: ResponseGetEnvios;
}) {
    const [envioParaEditar, setEnvioParaEditar] = useState<Envio | null>(null);
    const [envioParaExcluir, setEnvioParaExcluir] = useState<Envio | null>(null);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const listagem = useListagem<
        RequestGetEnvios,
        ResponseGetEnvios,
        Envio
    >({
        funcao: buscarEnvios,
        filtrosIniciais: {
            codBgk: '',
            destinatario: '',
            idTipoEnvio: '',
            codRastreio: '',
            status: '',
            dataEnvioIni: '',
            dataEnvioFim: '',
            dataChegadaIni: '',
            dataChegadaFim: '',
            dataPrazoPostagemIni: '',
            dataPrazoPostagemFim: '',
            page: '1',
            limit: '10'
        },
        obterItens: (resposta) => resposta.dados,
        obterMetadados: (resposta) => resposta.metadados,
        initialDados: dadosIniciais,
        autoBuscar: true,
        camposAutoBusca: [
            'codBgk',
            'destinatario',
            'idTipoEnvio',
            'codRastreio',
            'status',
            'dataEnvioIni',
            'dataEnvioFim',
            'dataChegadaIni',
            'dataChegadaFim',
            'dataPrazoPostagemIni',
            'dataPrazoPostagemFim'
        ]
    });

    function concluirOperacao(mensagemSucesso: string) {
        setEnvioParaEditar(null);
        setEnvioParaExcluir(null);
        setMensagem(mensagemSucesso);
        void listagem.recarregar();
    }

    return (
        <div className="space-y-4">
            {mensagem && (
                <p
                    role="status"
                    className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                >
                    {mensagem}
                </p>
            )}

            <TemplateListagem
                titulo="Envios de Kits"
                dados={listagem.dados}
                metadados={listagem.metadados}
                carregando={listagem.carregando}
                erro={listagem.erro}
                filtros={listagem.filtros}
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(envio) => envio.idEnvio}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onLimparFiltros={listagem.handleLimparFiltros}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                acoesExtra={(envio) => (
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setEnvioParaEditar(envio)}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                            title="Editar envio"
                            aria-label={`Editar envio ${envio.idEnvio}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setEnvioParaExcluir(envio)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-800"
                            title="Excluir envio"
                            aria-label={`Excluir envio ${envio.idEnvio}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                )}
                mensagemVazio="Nenhum envio encontrado."
            />

            {envioParaEditar && (
                <ModalFormulario
                    aberto
                    titulo={`Editar envio #${envioParaEditar.idEnvio}`}
                    onClose={() => setEnvioParaEditar(null)}
                >
                    <FormEditarEnvio
                        envio={envioParaEditar}
                        onSucesso={concluirOperacao}
                    />
                </ModalFormulario>
            )}

            {envioParaExcluir && (
                <ModalFormulario
                    aberto
                    titulo={`Excluir envio #${envioParaExcluir.idEnvio}`}
                    onClose={() => setEnvioParaExcluir(null)}
                    largura="md"
                >
                    <ConfirmarExclusaoEnvio
                        envio={envioParaExcluir}
                        onCancelar={() => setEnvioParaExcluir(null)}
                        onSucesso={concluirOperacao}
                    />
                </ModalFormulario>
            )}
        </div>
    );
}
