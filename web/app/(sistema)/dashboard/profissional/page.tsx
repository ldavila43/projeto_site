import { ViewProfissional } from '@/components/dashboard/ViewProfissional'
import { buscarDadosProfissionais } from '@/actions/dashBoardActions';
import { transformarExamesParaGrafico } from '@/utils/transformarExames';


export default async function HomeProfissional() {

    return (
        <ViewProfissional
        />
    );
}