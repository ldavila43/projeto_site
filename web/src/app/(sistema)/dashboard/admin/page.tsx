import ViewAdmin from '@/src/modules/dashboard/components/dashboard/ViewAdmin';
import { buscarDadosAdmin } from '@/src/modules/dashboard/dashBoardActions';

export default async function HomeAdmin() {

    const anoAtual = new Date().getFullYear().toString();

    const dados = await buscarDadosAdmin(anoAtual)
    return (
        <ViewAdmin
            dadosIni={dados}
            anoDefault={anoAtual}
        />
    )
}