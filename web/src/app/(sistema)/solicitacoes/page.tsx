import ViewSolicitacoes from '@/src/modules/solicitacoes_exame/components/ViewSolicitacoes';
import { buscarDadosSolicitacoes } from '@/src/modules/solicitacoes_exame/solicitacoesActions'


export default async function FormNovaSolicitacao() {
    const dadosIni = await buscarDadosSolicitacoes({ limit: 10, page: '1'});

    console.log(dadosIni)
    return (
        <div>
            <ViewSolicitacoes
            dadosIni={dadosIni} />
        </div>
    )
}