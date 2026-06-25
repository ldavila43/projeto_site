import { ViewProfissional } from '@/src/modules/dashboard/components/dashboard/ViewProfissional'
import { buscarDadosProfissionais } from '@/src/modules/dashboard/dashBoardActions';
import { transformarExamesParaGrafico } from '@/src/shared/utils/transformarExames';


export default async function HomeProfissional() {

    return (
        <ViewProfissional
        />
    );
}