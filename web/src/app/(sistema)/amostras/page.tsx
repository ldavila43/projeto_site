import ViewAmostras from '@/src/modules/amostras/components/ViewAmostras';
import { buscarAmostras } from '@/src/modules/amostras/amostrasActions';

export default async function AmostrasPage() {
    const dados = await buscarAmostras({ page: '1', limit: '10' });
    return <ViewAmostras dadosIni={dados} />;
}
