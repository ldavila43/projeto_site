'use client'
import { useContext, useState } from 'react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { PacienteDTO, FiltrosBuscaPaciente, PacienteResponse } from '@/src/modules/pacientes/PacientesDTO';
import { buscarDadosPacientes, cadastrarPaciente } from '@/src/modules/pacientes/pacientesActions';
import { buscarDadosPessoa, atualizarPessoa } from '@/src/modules/pessoas/pessoasActions';
import ModalDetalhesPessoa from '@/src/modules/pessoas/components/ModalDetalhesPessoa';
import { Eye } from 'lucide-react';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import FormCadastroVinculo from '@/src/modules/pessoas/components/FormCadastroVinculo';
import { Plus } from 'lucide-react';
import { AuthContext } from '@/src/shared/AuthContext';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import { formatarData } from '@/src/shared/utils/formatarData';

const colunas: ColunaTabela<PacienteDTO>[] = [
    { chave: 'nome', titulo: 'Nome Paciente', className: 'font-medium text-gray-800' },
    { chave: 'idPaciente', titulo: 'Id do Paciente' },
    {
        chave: 'criadoEm',
        titulo: 'Criado Em',
        render: (paciente) => formatarData(paciente.criadoEm)
    },
    {
        chave: 'atualizadoEm',
        titulo: 'Atualizado Em',
        render: (paciente) => formatarData(paciente.atualizadoEm)
    },
]

const camposFiltro: CampoFiltroConfig<FiltrosBuscaPaciente>[] = [
    { tipo: 'texto', name: 'nome', label: 'Nome do Paciente' },
    { tipo: 'texto', name: 'documentoPaciente', label: 'Documento de Identificação' },
    { tipo: 'texto', name: 'idProfissional', label: 'ID do Profissional' },
];

export default function TemplatePacientes({ dadosIni }: { dadosIni: PacienteResponse }) {
    const contexto = useContext(AuthContext);

    const [modalAberto, setModalAberto] = useState(false);
    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [pessoaSelecionada, setPessoaSelecionada] = useState<string | null>(null);
    function handleAbrirDetalhes(paciente: PacienteDTO) {
        setPessoaSelecionada(paciente.idPessoa);
        setModalAberto(true);
    }

    const listagem = useListagem<FiltrosBuscaPaciente, PacienteResponse, PacienteDTO>({
        funcao: buscarDadosPacientes,
        filtrosIniciais: { nome: '', documentoPaciente: '', idProfissional: '', limit: '10', page: '1' },
        obterItens: (res) => res.pacientes,
        obterMetadados: (res) => res.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: ['nome', 'documentoPaciente', 'idProfissional'],
    });

    function handleFecharModal() {
        setModalAberto(false);
        setPessoaSelecionada(null);
    }

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
                erro={listagem.erro}
                filtros={listagem.filtros}
                onChangeFiltro={listagem.handleChange}
                onPesquisar={listagem.handlePesquisar}
                onLimparFiltros={listagem.handleLimparFiltros}
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
                acaoHeader={{ label: 'Novo Paciente', icone: Plus, onClick: () => setModalCadastroAberto(true) }}
                mensagemVazio="Nenhum paciente encontrado."
            />
            
            {pessoaSelecionada && (
                <ModalDetalhesPessoa
                    isOpen={modalAberto}
                    onClose={handleFecharModal}
                    titulo="Detalhes do Paciente"
                    funcaoBusca={buscarDadosPessoa}
                    funcaoEdicao={atualizarPessoa}
                    filtros={{ idPessoa: pessoaSelecionada }}
                    onSucesso={() => void listagem.recarregar()}
                    permitirEditarDocumento={contexto?.perfilAtivo === PERFIS.ADMINISTRADOR}
                />
            )}

            <ModalFormulario
                aberto={modalCadastroAberto}
                titulo="Novo Paciente"
                onClose={() => setModalCadastroAberto(false)}
                largura="xl"
            >
                <FormCadastroVinculo
                    tipo="paciente"
                    salvar={cadastrarPaciente}
                    onSucesso={() => {
                        setModalCadastroAberto(false);
                        void listagem.recarregar();
                    }}
                />
            </ModalFormulario>
        </div>
    );
}
