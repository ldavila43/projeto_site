import { fetchAutenticado } from '@/src/shared/Service';
import { ResponseGetTiposExame, RequestGetTiposExame, RequestPostTipoExame } from './TiposExameDTO';

interface RespostaCadastroTipoExame {
    message: string;
}

export async function servicoGetTiposExame(
    token: string,
    perfilAtivo: string,
    filtros: RequestGetTiposExame
): Promise<ResponseGetTiposExame> {
    return fetchAutenticado('GET', '/tipos-exame/dados', token, perfilAtivo, filtros);
}

export async function servicoPostTipoExame(
    token: string,
    perfilAtivo: string,
    dados: RequestPostTipoExame
): Promise<RespostaCadastroTipoExame> {
    return fetchAutenticado('POST', '/tipos-exame/novo', token, perfilAtivo, dados);
}
