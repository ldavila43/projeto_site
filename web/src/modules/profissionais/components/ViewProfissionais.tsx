'use client'
import { useContext, useState } from 'react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosProfissionais, cadastrarProfissional } from '../profissionaisActions';
import { ProfissionaisResponse, FiltrosBuscaProfissional, ProfissionalDTO } from '@/src/modules/profissionais/profissionaisDTO';
import ModalDetalhesPessoa from '@/src/modules/pessoas/components/ModalDetalhesPessoa';
import { Eye, Plus } from 'lucide-react';
import { buscarDadosPessoa, atualizarPessoa } from '@/src/modules/pessoas/pessoasActions';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import FormCadastroVinculo from '@/src/modules/pessoas/components/FormCadastroVinculo';
import { AuthContext } from '@/src/shared/AuthContext';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';
import { formatarData } from '@/src/shared/utils/formatarData';

const colunas: ColunaTabela<ProfissionalDTO>[] = [
    { chave: 'nome', titulo: 'Nome', className: 'font-medium text-gray-800' },
    { chave: 'profissaoRegistro', titulo: 'Profissão / Registro' },
    {
        chave: 'criadoEm',
        titulo: 'Criado Em',
        render: (profissional) => formatarData(profissional.criadoEm)
    },
    {
        chave: 'atualizadoEm',
        titulo: 'Atualizado Em',
        render: (profissional) => formatarData(profissional.atualizadoEm)
    },
];

const camposFiltro: CampoFiltroConfig<FiltrosBuscaProfissional>[] = [
    { tipo: 'texto', name: 'nome', label: 'Nome do Profissional' },
    { tipo: 'texto', name: 'documentoProfissional', label: 'Documento de Identificação' },
];

export default function ViewProfissionais({ dadosIni }: { dadosIni: ProfissionaisResponse }){
    const contexto = useContext(AuthContext);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [pessoaSelecionada, setPessoaSelecionada] = useState<string | null>(null);
    function handleAbrirDetalhes(paciente: ProfissionalDTO) {
        setPessoaSelecionada(paciente.idPessoa);
        setModalAberto(true);
    }

    const listagem = useListagem<FiltrosBuscaProfissional, ProfissionaisResponse, ProfissionalDTO>({
        funcao: buscarDadosProfissionais,
        filtrosIniciais: { nome: '', documentoProfissional: '', limit: '10', page: '1' },
        obterItens: (res) => res.profissionais,
        obterMetadados: (res) => res.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: ['nome', 'documentoProfissional'],
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
                getKey={(t) => t.idProfissional}
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
                acaoHeader={{ label: 'Novo Profissional', icone: Plus, onClick: () => setModalCadastroAberto(true) }}
                mensagemVazio="Nenhum profissional encontrado."
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
                titulo="Novo Profissional"
                onClose={() => setModalCadastroAberto(false)}
                largura="xl"
            >
                <FormCadastroVinculo
                    tipo="profissional"
                    salvar={cadastrarProfissional}
                    onSucesso={() => {
                        setModalCadastroAberto(false);
                        void listagem.recarregar();
                    }}
                />
            </ModalFormulario>
        </div>
    );
}
