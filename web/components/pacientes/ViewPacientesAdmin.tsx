import { buscarDadosPacientesAdmin } from '@/actions/pacientesActions';
import TemplatePacientes from '@/components/pacientes/TemplatePacientes';
import { PacienteResponse } from '@/models/PacientesDTO';


export default function ViewPacientesAdmin({ dadosIni }: { dadosIni: PacienteResponse }){

    return (
        <div>
            <TemplatePacientes
            initialDados={dadosIni}
            funcao={buscarDadosPacientesAdmin} />
        </div>
    );
}