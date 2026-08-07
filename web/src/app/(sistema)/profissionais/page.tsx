import ViewProfissionais from '@/src/modules/profissionais/components/ViewProfissionais'
import { buscarDadosProfissionais } from '@/src/modules/profissionais/profissionaisActions';

export default async function HomeOperadores() {
    const dados = await buscarDadosProfissionais({ limit: '10', page: '1' });
    return (
        <div>
            <ViewProfissionais dadosIni={dados} />
        </div>
    )
}
