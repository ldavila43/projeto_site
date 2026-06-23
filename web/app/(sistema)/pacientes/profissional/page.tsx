import ViewPacientesProfissional from '@/components/pacientes/ViewPacientesProfissional'
import { buscarDadosPacientesProfissional } from '@/actions/pacientesActions'

export default async function HomeExames() {
    const dadosIni = await buscarDadosPacientesProfissional({ limit: '10', page: '1' });
    
    return (
        <div>
            <ViewPacientesProfissional dadosIni={dadosIni} />
        </div>
    )
}