import ViewPacientesAdmin from '@/components/pacientes/ViewPacientesAdmin';
import { buscarDadosPacientesAdmin } from '@/actions/pacientesActions';


export default async function HomeExames() {
    const dados = await buscarDadosPacientesAdmin({ limit: '10', page: '1' });
    return (
        <div>
            <ViewPacientesAdmin dadosIni={dados}/>
        </div>
    )
}