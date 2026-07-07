'use client'
import { useState } from 'react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import ModalNovoTipoExame from './ModalNovoTipoExame';
import { buscarDadosTiposExame } from '@/src/modules/tipos_exame/tiposExameActions';
import { TipoExame, ResponseGetTiposExame, RequestGetTiposExame } from '../TiposExameDTO';

const colunas: ColunaTabela<TipoExame>[] = [
    { chave: 'idTipoExame', titulo: 'ID', className: 'w-16 text-gray-500' },
    { chave: 'descricao', titulo: 'Tipo Exame', className: 'font-medium text-gray-800' },
    { chave: 'categoriaExame', titulo: 'Categoria' },
    {
        chave: 'status',
        titulo: 'Status',
        render: (tipo) => (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                tipo.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                {tipo.status}
            </span>
        )
    },
];

const camposFiltro: CampoFiltroConfig<RequestGetTiposExame>[] = [
    { tipo: 'texto', name: 'descricao', label: 'Tipo Exame' },
    { tipo: 'texto', name: 'categoriaExame', label: 'Categoria' },
    {
        tipo: 'select', name: 'status', label: 'Status',
        opcoes: [
            { value: '', label: 'Todos' },
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'INATIVO', label: 'Inativo' },
        ]
    },
];

export default function ViewTiposExame({ dadosIni }: { dadosIni: ResponseGetTiposExame }) {
    const [modalAberto, setModalAberto] = useState(false);

    const listagem = useListagem<RequestGetTiposExame, ResponseGetTiposExame, TipoExame>({
        funcao: buscarDadosTiposExame,
        filtrosIniciais: { descricao: '', status: '', categoriaExame: '', limit: '10', page: '1' },
        obterItens: (res) => res.tiposExame,
        obterMetadados: (res) => res.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: ['descricao', 'status', 'categoriaExame'],
    });

    return (
        <div>
            <TemplateListagem
                titulo="Tipos de Exame"
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(t) => t.idTipoExame}
                dados={listagem.dados}
                metadados={listagem.metadados}
                carregando={listagem.carregando}
                filtros={listagem.filtros}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                acaoHeader={{ label: 'Novo Tipo de Exame', onClick: () => setModalAberto(true) }}
                mensagemVazio="Nenhum tipo de exame encontrado."
            />

            <ModalNovoTipoExame
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                onSucesso={() => { setModalAberto(false); listagem.recarregar(); }}
            />
        </div>
    );
}