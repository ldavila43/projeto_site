import ViewTiposExame from '@/src/modules/tipos_exame/components/ViewTiposExame';
import { buscarDadosTiposExame } from '@/src/modules/tipos_exame/tiposExameActions'


export default async function FormNovaSolicitacao() {
    const dadosIni = await buscarDadosTiposExame({ limit: '10', page: '1'});
    return (
        <div>
            <ViewTiposExame
            dadosIni={dadosIni} />
        </div>
    )
}