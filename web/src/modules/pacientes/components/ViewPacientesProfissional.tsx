// ViewPacientesProfissional.tsx
import { buscarDadosPacientes } from '@/src/modules/pacientes/pacientesActions';
import TemplatePacientes from './ViewPacientes';
import { PacienteResponse } from '@/src/modules/pacientes/PacientesDTO';

export default function ViewPacientesProfissional({ dadosIni }: { dadosIni: PacienteResponse }) {
    return (
        <TemplatePacientes
            funcao={buscarDadosPacientes}
            initialDados={dadosIni}
        />
    );
}