import ViewSolicitacoes from '@/src/modules/solicitacoes_exame/components/ViewSolicitacoes';
import { buscarDadosSolicitacoes } from '@/src/modules/solicitacoes_exame/solicitacoesActions'


export default async function FormNovaSolicitacao() {
    const dadosIni = await buscarDadosSolicitacoes({ limit: 10, page: '1'});
    return (
        <div>
            <ViewSolicitacoes
            dadosIni={dadosIni} />
        </div>
    )
}