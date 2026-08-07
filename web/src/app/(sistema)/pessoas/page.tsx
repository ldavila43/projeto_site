import ViewPessoas from '@/src/modules/pessoas/components/ViewPessoas';
import { buscarDadosPessoas } from '@/src/modules/pessoas/pessoasActions';

export default async function PessoasPage() {
    const dados = await buscarDadosPessoas({ limit: '10', page: '1' });

    return <ViewPessoas dadosIni={dados} />;
}
