'use client'
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosTiposKitAmostra } from '@/src/modules/tipos_kit_amostra/tiposKitAmostraActions';
import { TiposKitAmostra, ResponseGetTiposKit, RequestGetTiposKit } from '../TiposKitAmostraDTO';

const colunas: ColunaTabela<TiposKitAmostra>[] = [
    { chave: 'idTipoKit', titulo: 'ID', className: 'w-16 text-gray-500' },
    { chave: 'materialColeta', titulo: 'Material Coleta', className: 'font-medium text-gray-800' },
    { chave: 'tipoAmostra', titulo: 'Categoria' },
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

const camposFiltro: CampoFiltroConfig<RequestGetTiposKit>[] = [
    { tipo: 'texto', name: 'materialColeta', label: 'Material Coleta' },
    { tipo: 'texto', name: 'tipoAmostra', label: 'Tipo de Amostra' },
    {
        tipo: 'select', name: 'status', label: 'Status',
        opcoes: [
            { value: '', label: 'Todos' },
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'INATIVO', label: 'Inativo' },
        ]
    },
];

export default function ViewTiposKitAmostra({ dadosIni }: { dadosIni: ResponseGetTiposKit }) {
    const listagem = useListagem<RequestGetTiposKit, ResponseGetTiposKit, TiposKitAmostra>({
        funcao: buscarDadosTiposKitAmostra,
        filtrosIniciais: { materialColeta: '', status: '', tipoAmostra: '', limit: '10', page: '1' },
        obterItens: (res) => res.tiposKit,
        obterMetadados: (res) => res.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: ['materialColeta', 'status', 'tipoAmostra'],
    });

    return (
        <div>
            <TemplateListagem
                titulo="Tipos de Kit de Amostra"
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(t) => t.idTipoKit}
                dados={listagem.dados}
                metadados={listagem.metadados}
                carregando={listagem.carregando}
                erro={listagem.erro}
                filtros={listagem.filtros}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onLimparFiltros={listagem.handleLimparFiltros}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                mensagemVazio="Nenhum tipo de kit amostra encontrado."
            />
        </div>
    );
}
