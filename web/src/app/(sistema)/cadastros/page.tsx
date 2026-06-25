import ViewOperadores from '@/src/modules/operadores/components/ViewOperadores';
import { buscarDadosOperadores } from '@/src/modules/operadores/operadoresActions';


export default async function HomeOperadores() {
    const dados = await buscarDadosOperadores({ limit: '10', page: '1' });
    return (
        <div>
            <ViewOperadores />
        </div>
    )
}