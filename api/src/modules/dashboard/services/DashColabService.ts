import { buscaEstatisticasPacientes, buscaEstatisticasProfissionais, buscaEstatisticasSolicitacoes, buscaEstatisticasExame, buscaEstatisticasTipoExame } from '../Repositories/ColaboradorRepository';
import { ResponseCardsResumo, ResponseCardTipoExame, TiposExame} from '../DTO/DashColaboradorDTO'

export async function servicoCardsResumoDashColaborador(): Promise<ResponseCardsResumo> {
    const [cardPacientes, cardProfissionais, cardSolicitacoes, cardExames] = await Promise.all(
        [buscaEstatisticasPacientes(),
        buscaEstatisticasProfissionais(),
        buscaEstatisticasSolicitacoes(), 
        buscaEstatisticasExame()]
    )

    return {
        cardPacientes,
        cardProfissionais,
        cardSolicitacoes,
        cardExames
    }
}

export async function servicoEstatisticasTipoExameColaborador(dataIni?: Date, dataFim?: Date, limit?: number): Promise<ResponseCardTipoExame> {

    const cardDadosTipoExame: TiposExame[] =
        await buscaEstatisticasTipoExame(dataIni, dataFim);

    return {
        TiposExame: cardDadosTipoExame
    };
}