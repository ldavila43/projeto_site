'use client'
import { useState } from 'react';
import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosProfissionais } from '../profissionaisActions';
import { ProfissionaisResponse, FiltrosBuscaProfissional, ProfissionalDTO } from '@/src/modules/profissionais/profissionaisDTO';
import ModalDetalhesPessoa from '@/src/modules/pessoas/components/ModalDetalhesPessoa';
import { Eye } from 'lucide-react';
import { buscarDadosPessoa, atualizarPessoa } from '@/src/modules/pessoas/pessoasActions';

const colunas: ColunaTabela<ProfissionalDTO>[] = [
    { chave: 'nome', titulo: 'Nome', className: 'font-medium text-gray-800' },
    { chave: 'profissaoRegistro', titulo: 'Profissão / Registro' },
    {
        chave: 'criadoEm',
        titulo: 'Criado Em',
        render: (profissional) => profissional.criadoEm ? new Date(profissional.criadoEm).toLocaleDateString('pt-BR') : '-'
    },
    {
        chave: 'atualizadoEm',
        titulo: 'Atualizado Em',
        render: (profissional) => profissional.atualizadoEm ? new Date(profissional.atualizadoEm).toLocaleDateString('pt-BR') : '-'
    },
];

const camposFiltro: CampoFiltroConfig<FiltrosBuscaProfissional>[] = [
    { tipo: 'texto', name: 'nome', label: 'Nome do Profissional' },
];

export default function ViewProfissionais({ dadosIni }: { dadosIni: ProfissionaisResponse }){
    const [modalAberto, setModalAberto] = useState(false);
    const [pessoaSelecionada, setPessoaSelecionada] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    function handleAbrirDetalhes(paciente: ProfissionalDTO) {
        setPessoaSelecionada(paciente.idPessoa);
        setModalAberto(true);
    }

    const listagem = useListagem<FiltrosBuscaProfissional, ProfissionaisResponse, ProfissionalDTO>({
        funcao: buscarDadosProfissionais,
        filtrosIniciais: { nome: '', limit: '10', page: '1' },
        obterItens: (res) => res.profissionais,
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
                getKey={(t) => t.idProfissional}
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
                acaoHeader={{ label: 'Novo Profissional', onClick: () => setModalAberto(true) }}
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