'use client'

import { useState } from 'react';
import { Plus } from 'lucide-react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosKitsAmostra } from '../kitsAmostraActions';
import { KitAmostra, ResponseGetKits, RequestGetKits } from '../KitsAmostraDTO';
import ModalNovoKitAmostra from './ModalNovoKitAmostra';

const camposFiltro: CampoFiltroConfig<RequestGetKits>[] = [
    { tipo: 'texto', name: 'codBgk', label: 'Código BGK' },
    { tipo: 'texto', name: 'codLote', label: 'Lote' },
    { tipo: 'texto', name: 'tipoKit', label: 'Tipo de Kit' },
    {
        tipo: 'select',
        name: 'status',
        label: 'Status',
        opcoes: [
            { value: '', label: 'Todos' },
            { value: 'INATIVO', label: 'Inativo' },
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'INVÁLIDO', label: 'Inválido' },
            { value: 'DESCARTADO', label: 'Descartado' }
        ]
    }
];

const colunas: ColunaTabela<KitAmostra>[] = [
    { chave: 'codBgk', titulo: 'Cód. BGK', className: 'font-medium text-gray-800' },
    { chave: 'codLote', titulo: 'Lote' },
    { chave: 'codApoio', titulo: 'Cód. Apoio', render: (kit) => kit.codApoio || '-' },
    { chave: 'tipoKit', titulo: 'Tipo do Kit' },
    { chave: 'responsavel', titulo: 'Responsável', render: (kit) => kit.responsavel || '-' },
    {
        chave: 'dataAtivacao',
        titulo: 'Ativação',
        render: (kit) => kit.dataAtivacao
            ? new Date(kit.dataAtivacao).toLocaleDateString('pt-BR')
            : '-'
    },
    {
        chave: 'dataValidade',
        titulo: 'Validade',
        render: (kit) => kit.dataValidade
            ? new Date(kit.dataValidade).toLocaleDateString('pt-BR')
            : '-'
    },
    {
        chave: 'status',
        titulo: 'Status',
        render: (kit) => (
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                kit.status === 'ATIVO'
                    ? 'bg-green-100 text-green-800'
                    : kit.status === 'VENCIDO' || kit.status === 'INVÁLIDO'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
            }`}>
                {kit.status}
            </span>
        )
    }
];

export default function ViewKitsAmostra({ dadosIni }: { dadosIni: ResponseGetKits }) {
    const [modalAberto, setModalAberto] = useState(false);

    const listagem = useListagem<RequestGetKits, ResponseGetKits, KitAmostra>({
        funcao: buscarDadosKitsAmostra,
        filtrosIniciais: {
            codBgk: '',
            codLote: '',
            tipoKit: '',
            status: '',
            limit: '10',
            page: '1'
        },
        obterItens: (resposta) => resposta.kitsAmostra,
        obterMetadados: (resposta) => resposta.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: ['codBgk', 'codLote', 'tipoKit', 'status']
    });

    function handleSucesso() {
        setModalAberto(false);
        void listagem.recarregar();
    }

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
                filtros={listagem.filtros}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                acaoHeader={{
                    label: 'Novo Kit',
                    icone: Plus,
                    onClick: () => setModalAberto(true)
                }}
                mensagemVazio="Nenhum kit encontrado."
            />

            <ModalNovoKitAmostra
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                onSucesso={handleSucesso}
            />
        </div>
    );
}
