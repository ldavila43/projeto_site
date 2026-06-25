import { buscarDadosPacientes } from '@/src/modules/pacientes/pacientesActions';
import TemplatePacientes from './ViewPacientes';
import { PacienteResponse } from '@/src/modules/pacientes/PacientesDTO';


export default function ViewPacientesAdmin({ dadosIni }: { dadosIni: PacienteResponse }){

    return (
        <div>
            <TemplatePacientes
            initialDados={dadosIni}
            funcao={ buscarDadosPacientes } />
        </div>
    );
}