import { ViewProfissional } from '@/src/modules/dashboard/components/dashboard/ViewProfissional'
import { buscarDadosProfissionais } from '@/src/modules/dashboard/dashBoardActions';
import { formatarDataParaInput } from '@/src/shared/utils/formatarData';


export default async function HomeProfissional() {
    const dataFim = formatarDataParaInput(new Date());
    const dataIni = `${dataFim.slice(0, 4)}-01-01`;
    const dados = await buscarDadosProfissionais(undefined, dataIni, dataFim);

    return (
        <ViewProfissional
            dadosIni={dados}
            dataIniInicial={dataIni}
            dataFimInicial={dataFim}
        />
    );
}
