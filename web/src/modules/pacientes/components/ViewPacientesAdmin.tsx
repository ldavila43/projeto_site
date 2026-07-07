'use client'
import { useState } from 'react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { PacienteDTO, FiltrosBuscaPaciente, PacienteResponse } from '@/src/modules/pacientes/PacientesDTO';
import { buscarDadosPacientes } from '@/src/modules/pacientes/pacientesActions';
import { buscarDadosPessoa, atualizarPessoa } from '@/src/modules/pessoas/pessoasActions';
import ModalDetalhesPessoa from '@/src/modules/pessoas/components/ModalDetalhesPessoa';
import { Eye } from 'lucide-react';
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
];

export default function TemplatePacientes({ dadosIni }: { dadosIni: PacienteResponse }) {

    const [modalAberto, setModalAberto] = useState(false);
    const [pessoaSelecionada, setPessoaSelecionada] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    function handleAbrirDetalhes(paciente: PacienteDTO) {
        setPessoaSelecionada(paciente.idPessoa);
        setModalAberto(true);
    }

    const listagem = useListagem<FiltrosBuscaPaciente, PacienteResponse, PacienteDTO>({
        funcao: buscarDadosPacientes,
        filtrosIniciais: { nome: '', limit: '10', page: '1' },
        obterItens: (res) => res.pacientes,
        obterMetadados: (res) => res.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: ['nome'],
    });

    function handleFecharModal() {
        setModalAberto(false);
        setPessoaSelecionada(null);
    }

    return (
        <div>
            <TemplateListagem
                titulo="Profissionais"
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
                acoesExtra={(profissional) => (
                    <button
                        onClick={() => handleAbrirDetalhes(profissional)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                )}
                acaoHeader={{ label: 'Novo Paciente', onClick: () => setModalAberto(true) }}
                mensagemVazio="Nenhum tipo de exame encontrado."
            />
            
            {pessoaSelecionada && (
                <ModalDetalhesPessoa
                    isOpen={modalAberto}
                    onClose={handleFecharModal}
                    titulo="Detalhes do Paciente"
                    funcaoBusca={buscarDadosPessoa}
                    funcaoEdicao={atualizarPessoa}
                    filtros={{ idPessoa: pessoaSelecionada }}
                    onSucesso={() => setRefreshKey(prev => prev + 1)}
                />
            )}
        </div>
    );
}