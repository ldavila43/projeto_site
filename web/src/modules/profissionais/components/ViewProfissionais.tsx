'use client'
import { useState } from 'react';
import { buscarDadosProfissionais } from '../profissionaisActions';
import TemplateProfissionais from './TemplateProfissionais';
import { ProfissionaisResponse, ProfissionalDTO } from '@/src/modules/profissionais/profissionaisDTO';
import ModalDetalhesPessoa from '@/src/modules/pessoas/components/ModalDetalhesPessoa';
import { Eye } from 'lucide-react';
import { buscarDadosPessoa } from '@/src/modules/pessoas/pessoasActions';


export default function ViewProfissionais({ dadosIni }: { dadosIni: ProfissionaisResponse }){
    const [modalAberto, setModalAberto] = useState(false);
    const [pessoaSelecionada, setPessoaSelecionada] = useState<string | null>(null);
    function handleAbrirDetalhes(paciente: ProfissionalDTO) {
        setPessoaSelecionada(paciente.idPessoa);
        setModalAberto(true);
    }

    function handleFecharModal() {
        setModalAberto(false);
        setPessoaSelecionada(null);
    }

    return (
        <div>
            <TemplateProfissionais
                funcao={buscarDadosProfissionais}
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