import ViewEnvios from '@/src/modules/envios/components/ViewEnvios';
import { buscarEnvios } from '@/src/modules/envios/enviosActions';

export default async function EnviosPage() {
    const dadosIniciais = await buscarEnvios({
        page: '1',
        limit: '10'
    });

    return <ViewEnvios dadosIniciais={dadosIniciais} />;
}
