import { ViewPaciente } from '@/src/modules/dashboard/components/dashboard/ViewPaciente'
import { buscarDadosPacientes } from '@/src/modules/dashboard/dashBoardActions';

export default async function HomePaciente() {
    const dados = await buscarDadosPacientes();

    return (
        <ViewPaciente dados={dados} />
    )
}