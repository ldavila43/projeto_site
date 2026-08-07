import ViewColaborador from '@/src/modules/dashboard/components/dashboard/ViewColaborador'
import { buscarCardsLaboratorio, buscarGraficoLaboratorio } from '@/src/modules/dashboard/dashBoardActions';
import { formatarDataParaInput } from '@/src/shared/utils/formatarData';

export default async function HomeColaborador() {
    const dataFim = formatarDataParaInput(new Date());
    const dataIni = `${dataFim.slice(0, 4)}-01-01`;
    const [cards, grafico] = await Promise.all([
        buscarCardsLaboratorio(),
        buscarGraficoLaboratorio({
            dataIni,
            dataFim,
            limite: 10
        })
    ]);

    return (
        <ViewColaborador
            cards={cards}
            graficoInicial={grafico}
            dataIniInicial={dataIni}
            dataFimInicial={dataFim}
        />
    )
}
