import ViewKitsAmostra from '@/src/modules/kits_amostra/components/ViewKitsAmostra';
import { buscarDadosKitsAmostra } from '@/src/modules/kits_amostra/kitsAmostraActions';

export default async function KitsAmostraPage() {
    const dadosIni = await buscarDadosKitsAmostra({ limit: '10', page: '1' });

    return (
        <div>
            <ViewKitsAmostra dadosIni={dadosIni} />
        </div>
    )
}
