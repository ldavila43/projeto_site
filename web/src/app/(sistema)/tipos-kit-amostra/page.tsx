import ViewTiposKitAmostra from '@/src/modules/tipos_kit_amostra/components/TempĺateTipoKitAmostra';
import { buscarDadosTiposKitAmostra } from '@/src/modules/tipos_kit_amostra/tiposKitAmostraActions';


export default async function FormNovaSolicitacao() {
    const dadosIni = await buscarDadosTiposKitAmostra({ limit: '10', page: '1'});
    return (
        <div>
            <ViewTiposKitAmostra
            dadosIni={dadosIni} />
        </div>
    )
}