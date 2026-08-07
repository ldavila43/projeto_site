'use client'

import { useState } from 'react';
import { Eye } from 'lucide-react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosExames } from '../examesActions';
import { Exames, ExamesResponseDTO, FiltrosBuscaExame } from '../ExamesDTO';
import ModalVisaoGeralExame from './ModalVisaoGeralExame';
import { formatarValorEnum, STATUS_EXAMES } from '@/src/shared/utils/StatusEnum';
import { formatarData } from '@/src/shared/utils/formatarData';

const camposFiltro: CampoFiltroConfig<FiltrosBuscaExame>[] = [
    { tipo: 'texto', name: 'tipoExame', label: 'Tipo de Exame' },
    { tipo: 'texto', name: 'nomePaciente', label: 'Paciente' },
    { tipo: 'texto', name: 'nomeProfissional', label: 'Profissional' },
    {
        tipo: 'select',
        name: 'status',
        label: 'Status',
        opcoes: [
            { value: '', label: 'Todos' },
            ...STATUS_EXAMES.map((status) => ({
                value: status,
                label: formatarValorEnum(status)
            }))
        ]
    },
    { tipo: 'texto', name: 'protocolo', label: 'Protocolo' }
];

const colunas: ColunaTabela<Exames>[] = [
    { chave: 'protocolo', titulo: 'Protocolo', className: 'font-medium text-gray-800' },
    { chave: 'nomePaciente', titulo: 'Paciente' },
    { chave: 'tipoExame', titulo: 'Tipo de Exame' },
    { chave: 'documentoPaciente', titulo: 'Documento' },
    { chave: 'nomeProfissional', titulo: 'Profissional', render: (exame) => exame.nomeProfissional || '-' },
    {
        chave: 'dataSolicitacao',
        titulo: 'Data',
        render: (exame) => formatarData(exame.dataSolicitacao)
    },
    {
        chave: 'status',
        titulo: 'Status',
        render: (exame) => (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                exame.status === 'LIBERADO'
                    ? 'bg-green-100 text-green-800'
                    : exame.status === 'CANCELADO'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
            }`}>
                {exame.status}
            </span>
        )
    }
];

export default function TemplateExames({ dadosIni }: { dadosIni: ExamesResponseDTO }) {
    const [exameSelecionado, setExameSelecionado] = useState<number | null>(null);
    const listagem = useListagem<FiltrosBuscaExame, ExamesResponseDTO, Exames>({
        funcao: buscarDadosExames,
        filtrosIniciais: {
            tipoExame: '',
            nomePaciente: '',
            nomeProfissional: '',
            protocolo: '',
            status: '',
            limit: '10',
            page: '1'
        },
        obterItens: (resposta) => resposta.dados,
        obterMetadados: (resposta) => resposta.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: ['tipoExame', 'nomePaciente', 'nomeProfissional', 'status', 'protocolo']
    });

    return (
        <>
            <TemplateListagem
                titulo="Exames"
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(exame) => exame.idExame}
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
                acoesExtra={(exame) => (
                    <button onClick={() => setExameSelecionado(exame.idExame)} className="p-1 text-blue-600" title="Ver resultado">
                        <Eye className="h-4 w-4" />
                    </button>
                )}
                mensagemVazio="Nenhum exame encontrado."
            />
            <ModalVisaoGeralExame idExame={exameSelecionado} onClose={() => setExameSelecionado(null)} />
        </>
    );
}
