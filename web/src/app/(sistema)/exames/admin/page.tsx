import TemplateExames from '@/src/modules/exames/components/TemplateExames';
import { buscarDadosExames } from '@/src/modules/exames/examesActions';

export default async function ExamesAdminPage() {
    const dados = await buscarDadosExames({ limit: '10', page: '1' });
    return <TemplateExames dadosIni={dados} />;
}
