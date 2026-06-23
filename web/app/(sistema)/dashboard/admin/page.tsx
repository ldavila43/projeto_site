import ViewAdmin from '@/components/dashboard/ViewAdmin';
import { buscarDadosAdmin } from '@/actions/dashBoardActions';

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