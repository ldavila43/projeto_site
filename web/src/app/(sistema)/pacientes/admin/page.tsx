import ViewPacientesAdmin from '@/src/modules/pacientes/components/ViewPacientesAdmin';
import { buscarDadosPacientes } from '@/src/modules/pacientes/pacientesActions';


export default async function HomePacientes() {
    const dados = await buscarDadosPacientes({ limit: '10', page: '1' });
    return (
        <div>
            <ViewPacientesAdmin dadosIni={dados}/>
        </div>
    )
}