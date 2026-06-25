import ViewPacientesProfissional from '@/src/modules/pacientes/components/ViewPacientesProfissional'
import { buscarDadosPacientes } from '@/src/modules/pacientes/pacientesActions'

export default async function HomeExames() {
    const dadosIni = await buscarDadosPacientes({ limit: '10', page: '1' });
    
    return (
        <div>
            <ViewPacientesProfissional dadosIni={dadosIni} />
        </div>
    )
}