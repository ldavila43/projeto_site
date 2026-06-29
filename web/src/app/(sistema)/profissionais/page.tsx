import ViewProfissionais from '@/src/modules/profissionais/components/ViewProfissionais'
import { buscarDadosProfissionais } from '@/src/modules/profissionais/profissionaisActions';

import ViewOperadores from '@/src/modules/operadores/components/ViewOperadores';


export default async function HomeOperadores() {
    const dados = await buscarDadosProfissionais({ limit: '10', page: '1' });
    return (
        <div>
            <ViewProfissionais dadosIni={dados} />
        </div>
    )
}