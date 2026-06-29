import ViewKitsAmostra from '@/src/modules/kits_amostra/components/ViewKitsAmostra';
import { buscarDadosKitsAmostra } from '@/src/modules/kits_amostra/kitsAmostraActions';
import { ResponseGetKits } from '@/src/modules/kits_amostra/KitsAmostraDTO'


export default async function FormNovaSolicitacao() {
    const dadosIni: ResponseGetKits = await buscarDadosKitsAmostra({ limit: '10', page: '1'});

    console.log(dadosIni)
    return (
        <div>
            <ViewKitsAmostra
            funcao={buscarDadosKitsAmostra}
            initialDados={dadosIni} />
        </div>
    )
}