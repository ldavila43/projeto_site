import TemplateTiposExame from '@/src/modules/tipos_exame/components/TemplateTiposExame';
import { buscarDadosTiposExame } from '@/src/modules/tipos_exame/tiposExameActions'


export default async function FormNovaSolicitacao() {
    const dadosIni = await buscarDadosTiposExame({ limit: '10', page: '1'});

    console.log(dadosIni)
    return (
        <div>
            <TemplateTiposExame
            funcao={buscarDadosTiposExame}
            initialDados={dadosIni} />
        </div>
    )
}