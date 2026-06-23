import { RequestExames } from './DTO/RequestExamesDTO';
import { buscaPorId } from '../examesRepostitory';
import { Exames } from '../ExamesDTO';
import { resolversVisaoGeral, resolverPainelGeral } from './resolvers/index'

async function servicoResultados(dadosReq: RequestExames, resolvers: Record<number, (req: RequestExames) => Promise<unknown>>) {
    const exame: Exames = await buscaPorId(dadosReq.idExame, dadosReq.idPaciente, dadosReq.idProfissional);

    console.log(!exame)
    if(!exame) {
        throw new Error('Exame não encontrado');
    }

    const resolver = resolvers[exame.categoriaExame];

    if (!resolver) {
        throw new Error(`Categoria de exame não suportada: ${exame.categoriaExame}`)
    };
    
    return resolver(dadosReq);
}

export const buscaVisaoGeral  = (req: RequestExames) => servicoResultados(req, resolversVisaoGeral);
export const buscaDadosPainel = (req: RequestExames) => servicoResultados(req, resolverPainelGeral);