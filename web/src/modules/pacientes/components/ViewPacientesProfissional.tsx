'use client'
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { PacienteDTO, FiltrosBuscaPaciente, PacienteResponse } from '@/src/modules/pacientes/PacientesDTO';
import { buscarDadosPacientes } from '@/src/modules/pacientes/pacientesActions';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';

const colunas: ColunaTabela<PacienteDTO>[] = [
    { chave: 'nome', titulo: 'Nome Paciente', className: 'font-medium text-gray-800' },
    { chave: 'idPaciente', titulo: 'Id do Paciente' },
    {
        chave: 'criadoEm',
        titulo: 'Criado Em',
        render: (paciente) => new Date(paciente.criadoEm).toLocaleDateString('pt-BR')
    },
    {
        chave: 'atualizadoEm',
        titulo: 'Atualizado Em',
        render: (paciente) => new Date(paciente.atualizadoEm).toLocaleDateString('pt-BR')
    },
]

const camposFiltro: CampoFiltroConfig<FiltrosBuscaPaciente>[] = [
    { tipo: 'texto', name: 'nome', label: 'Nome do Paciente' },
    { tipo: 'texto', name: 'documentoPaciente', label: 'Documento de Identificação' },
];

export default function TemplatePacientes({ dadosIni }: { dadosIni: PacienteResponse }) {
    const listagem = useListagem<FiltrosBuscaPaciente, PacienteResponse, PacienteDTO>({
        funcao: buscarDadosPacientes,
        filtrosIniciais: { nome: '', documentoPaciente: '', limit: '10', page: '1' },
        obterItens: (res) => res.pacientes,
        obterMetadados: (res) => res.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: ['nome', 'documentoPaciente'],
    });

    return (
        <div>
            <TemplateListagem
                titulo="Pacientes"
                colunas={colunas}
                camposFiltro={camposFiltro}
                getKey={(t) => t.idPaciente}
                dados={listagem.dados}
                metadados={listagem.metadados}
                carregando={listagem.carregando}
                filtros={listagem.filtros}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onMudarPagina={listagem.handlePagina}
                onMudarLimite={listagem.handleLimite}
                mensagemVazio="Nenhum paciente encontrado."
            />
        </div>
    );
}
