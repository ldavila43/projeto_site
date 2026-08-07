import ViewTiposEnvio from '@/src/modules/tipos_envio/components/ViewTiposEnvio';
import { buscarTiposEnvio } from '@/src/modules/tipos_envio/tiposEnvioActions';

export default async function TiposEnvioPage() {
    const dadosIniciais = await buscarTiposEnvio({
        page: '1',
        limit: '10'
    });

    return <ViewTiposEnvio dadosIniciais={dadosIniciais} />;
}
