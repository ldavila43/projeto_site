'use client'
import { PacienteDTO, FiltrosBuscaPaciente, PacienteResponse } from '@/src/modules/pacientes/PacientesDTO'
import { ReactNode } from 'react';
import Card from '@/src/shared/components/Card'
import CampoFiltro from '@/src/shared/components/CampoFIltro'
import TabelaDados, { ColunaTabela } from '@/src/shared/components/TabelaDados'
import { SearchIcon } from 'lucide-react'
import { usePacientes } from '../usePaciente';

export interface PacienteProps {
    funcao: (filtros: FiltrosBuscaPaciente) => Promise<PacienteResponse>;
    initialDados: PacienteResponse;
    acoesExtra?: (paciente: PacienteDTO) => ReactNode,
    refreshKey: number
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

export default function TemplatePacientes({ funcao, initialDados, acoesExtra, refreshKey = 0 }: PacienteProps) {
    const {
        dados,
        carregando,
        filtros,
        handleChange,
        handleLimite,
        handlePagina,
        handlePesquisar
    } = usePacientes(funcao, initialDados, refreshKey);

    return (
        <div>
            <Card titulo='Pacientes'>
                <div className="space-y-4">
                    <div id="filtros" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CampoFiltro
                            label="Nome"
                            id="nome"
                            name="nome"
                            value={filtros.nome || ''}
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