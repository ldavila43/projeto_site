'use client'

import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarAmostras } from '../amostrasActions';
import { Amostra, FiltrosAmostras, ResponseAmostras } from '../AmostrasDTO';
import { formatarValorEnum, STATUS_AMOSTRAS } from '@/src/shared/utils/StatusEnum';
import { formatarData } from '@/src/shared/utils/formatarData';

const camposFiltro: CampoFiltroConfig<FiltrosAmostras>[] = [
    { tipo: 'texto', name: 'tipoAmostra', label: 'Tipo de Amostra' },
    { tipo: 'texto', name: 'nomePaciente', label: 'Paciente' },
    { tipo: 'texto', name: 'nomeProfissional', label: 'Profissional' },
    {
        tipo: 'select',
        name: 'status',
        label: 'Status',
        opcoes: [
            { value: '', label: 'Todos' },
            ...STATUS_AMOSTRAS.map((status) => ({
                value: status,
                label: formatarValorEnum(status)
            }))
        ]
    },
    { tipo: 'data', name: 'dataIniColeta', label: 'Coleta Inicial' },
    { tipo: 'data', name: 'dataFimColeta', label: 'Coleta Final' },
    { tipo: 'data', name: 'dataIniRecebimento', label: 'Recebimento Inicial' },
    { tipo: 'data', name: 'dataFimRecebimento', label: 'Recebimento Final' },
    { tipo: 'data', name: 'dataIniEnvioApoio', label: 'Envio Apoio Inicial' },
    { tipo: 'data', name: 'dataFimEnvioApoio', label: 'Envio Apoio Final' },
    { tipo: 'data', name: 'dataIniResultadoApoio', label: 'Resultado Apoio Inicial' },
    { tipo: 'data', name: 'dataFimResultadoApoio', label: 'Resultado Apoio Final' }
];

const colunas: ColunaTabela<Amostra>[] = [
    { chave: 'tipoAmostra', titulo: 'Tipo', className: 'font-medium text-gray-800' },
    { chave: 'nomePaciente', titulo: 'Paciente' },
    { chave: 'nomeProfissional', titulo: 'Profissional', render: (amostra) => amostra.nomeProfissional || '-' },
    { chave: 'protocolosVinculados', titulo: 'Protocolos', render: (amostra) => amostra.protocolosVinculados?.join(', ') || '-' },
    {
        chave: 'flagRecoleta',
        titulo: 'Origem da coleta',
        render: (amostra) => amostra.flagRecoleta ? 'Recoleta' : 'Coleta inicial'
    },
    { chave: 'dataColeta', titulo: 'Coleta', render: (amostra) => formatarData(amostra.dataColeta) },
    { chave: 'dataRecebimento', titulo: 'Recebimento', render: (amostra) => formatarData(amostra.dataRecebimento) },
    {
        chave: 'status',
        titulo: 'Status',
        render: (amostra) => (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                amostra.status === 'PROCESSADA'
                    ? 'bg-green-100 text-green-800'
                    : amostra.status === 'DESCARTADA'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
            }`}>
                {formatarValorEnum(amostra.status)}
            </span>
        )
    }
];

export default function ViewAmostras({ dadosIni }: { dadosIni: ResponseAmostras }) {
    const listagem = useListagem<FiltrosAmostras, ResponseAmostras, Amostra>({
        funcao: buscarAmostras,
        filtrosIniciais: {
            tipoAmostra: '',
            nomePaciente: '',
            nomeProfissional: '',
            status: '',
            page: '1',
            limit: '10'
        },
        obterItens: (resposta) => resposta.amostras,
        obterMetadados: (resposta) => resposta.metadados,
        initialDados: dadosIni,
        autoBuscar: true
    });

    return (
        <TemplateListagem
            titulo="Amostras"
            dados={listagem.dados}
            metadados={listagem.metadados}
            carregando={listagem.carregando}
            erro={listagem.erro}
            filtros={listagem.filtros}
            colunas={colunas}
            camposFiltro={camposFiltro}
            getKey={(amostra) => amostra.idAmostra}
            onChangeFiltro={listagem.handleChange}
            onPesquisar={listagem.handlePesquisar}
            onLimparFiltros={listagem.handleLimparFiltros}
            onMudarPagina={listagem.handlePagina}
            onMudarLimite={listagem.handleLimite}
            mensagemVazio="Nenhuma amostra encontrada."
        />
    );
}
