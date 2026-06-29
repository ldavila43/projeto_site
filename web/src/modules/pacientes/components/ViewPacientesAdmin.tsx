'use client'
import { useState } from 'react';
import TemplatePacientes from './ViewPacientes';
import ModalDetalhesPessoa from '@/src/modules/pessoas/components/ModalDetalhesPessoa';
import { Eye } from 'lucide-react';
import { buscarDadosPacientes } from '@/src/modules/pacientes/pacientesActions';
import { buscarDadosPessoa } from '@/src/modules/pessoas/pessoasActions';
import { PacienteDTO, PacienteResponse } from '@/src/modules/pacientes/PacientesDTO';

export default function ViewPacientesAdmin({ dadosIni }: { dadosIni: PacienteResponse }) {
    const [modalAberto, setModalAberto] = useState(false);
    const [pessoaSelecionada, setPessoaSelecionada] = useState<string | null>(null);
    function handleAbrirDetalhes(paciente: PacienteDTO) {
        setPessoaSelecionada(paciente.idPessoa);
        setModalAberto(true);
    }

    function handleFecharModal() {
        setModalAberto(false);
        setPessoaSelecionada(null);
    }

    return (
        <div>
            <TemplatePacientes
                initialDados={dadosIni}
                funcao={buscarDadosPacientes}
                // 3. Injetamos o botão na tabela através do acoesExtra
                acoesExtra={(paciente) => (
                    <button
                        onClick={() => handleAbrirDetalhes(paciente)}
                        className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800 rounded-md transition-colors"
                        title="Ver Detalhes"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                )}
            />

            {pessoaSelecionada && (
                <ModalDetalhesPessoa
                    isOpen={modalAberto}
                    onClose={handleFecharModal}
                    titulo="Detalhes do Paciente"
                    funcao={buscarDadosPessoa}
                    filtros={{ idPessoa: pessoaSelecionada }}
                />
            )}
        </div>
    );
}