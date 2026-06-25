import Card from '@/src/shared/components/Card';
import { DashAdminDTO } from '@/src/modules/dashboard/ViewAdminDTO';
import { GraficoSolicitacoes } from '@/src/modules/dashboard/components/dashboard/GraficoSolicitacoes';

interface ViewAdminProps {
    dadosIni: DashAdminDTO;
    anoDefault: string;
}


export default function ViewAdmin({ dadosIni, anoDefault }: ViewAdminProps)  {
    return (
        <div >
            <span className='py-3 text-gray-600 text-base'>
                Esta é a área operacional para a gestão de usuários, atribuição de permissões e visualização global dos exames.
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card titulo="Usuários Ativos">
                <span className="text-4xl font-bold text-gray-900 mt-2">
                    {dadosIni.estatisticas!.usuarios}
                </span>
                </Card>
                <Card titulo="Colaboradores Ativos">
                <span className="text-4xl font-bold text-green-600 mt-2">
                    {dadosIni.estatisticas!.colaboradores}
                </span>
                </Card>
            </div>
            <GraficoSolicitacoes
            solicitacoesIni={dadosIni.solicitacoesPeriodo!}
            anosDisponiveis={dadosIni.anosDisponiveis!}
            anoDefault={anoDefault}
            />
        </div>
    );
}