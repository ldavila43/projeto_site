// ViewPacientesProfissional.tsx
import { buscarDadosPacientesProfissional } from '@/actions/pacientesActions';
import TemplatePacientes from '@/components/pacientes/TemplatePacientes';
import { PacienteResponse } from '@/models/PacientesDTO';

export default function ViewPacientesProfissional({ dadosIni }: { dadosIni: PacienteResponse }) {
    return (
        <TemplatePacientes
            funcao={buscarDadosPacientesProfissional}
            initialDados={dadosIni}
        />
    );
}