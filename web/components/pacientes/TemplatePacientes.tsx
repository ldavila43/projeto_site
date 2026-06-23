'use client'
import { PacienteDTO, FiltrosBuscaPaciente, PacienteResponse } from '@/models/PacientesDTO'
import { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card'
import { ReactNode } from 'react';
import CampoFiltro from '@/components/ui/CampoFIltro'
import TabelaDados, { ColunaTabela } from '@/components/ui/TabelaDados'
import { SearchIcon } from 'lucide-react'

export interface PacienteProps {
    funcao: (filtros: FiltrosBuscaPaciente) => Promise<PacienteResponse>;
    initialDados: PacienteResponse;
    acoesExtra?: (paciente: PacienteDTO) => ReactNode;
}

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

export default function TemplatePacientes({ funcao, initialDados, acoesExtra }: PacienteProps) {
    const [dados, setDados] = useState<PacienteResponse>(initialDados);
    const [carregando, setCarregando] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosBuscaPaciente>({
        nome: undefined,
        limit: '10',
        page: '1',
    });

    const primeiroRender = useRef(true);

    useEffect(() => {
        if (primeiroRender.current) {
            primeiroRender.current = false;
            return;
        }

        async function buscar() {
            setCarregando(true);
            try {
                const resultado = await funcao(filtros);
                setDados(resultado);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscar();
    }, [filtros]);

    function handleLimite(novoLimite: string) {
        setFiltros(prev => ({ ...prev, limit: novoLimite, page: '1' }));
    }

    function handlePagina(operacao: 'anterior' | 'proxima') {
        setFiltros(prev => ({
            ...prev,
            page: operacao === 'anterior'
                ? (Number(prev.page) - 1).toString()
                : (Number(prev.page) + 1).toString()
        }));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    }

    function handlePesquisar() {
        setFiltros(prev => ({ ...prev, page: '1' }));
    }

    return (
        <div>
            <Card titulo='Pacientes'>
                <div className="space-y-4">
                    <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CampoFiltro
                            label="Nome"
                            id="nome"
                            name="nome"
                            value={filtros.nome}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type="button"
                            onClick={handlePesquisar}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <SearchIcon className="h-4 w-4" />
                            Pesquisar
                        </button>
                    </div>
                </div>

                <TabelaDados<PacienteDTO>
                    dados={dados.pacientes}
                    colunas={colunas}
                    metadados={dados.metadados}
                    pagina={filtros.page!}
                    limite={filtros.limit!}
                    getKey={(paciente) => paciente.idPessoa}
                    onMudarPagina={handlePagina}
                    onMudarLimite={handleLimite}
                    carregando={carregando}
                    mensagemVazio="Nenhum paciente encontrado."
                    acoesExtra={acoesExtra}
                />
            </Card>
        </div>
    );
}