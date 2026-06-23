import { ViewPaciente } from '@/components/dashboard/ViewPaciente'
import { buscarDadosPacientes } from '@/actions/dashBoardActions';

export default async function HomePaciente() {
    const dados = await buscarDadosPacientes();

    return (
        <ViewPaciente dados={dados} />
    )
}