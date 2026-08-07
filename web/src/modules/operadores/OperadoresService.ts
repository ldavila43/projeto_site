import { fetchAutenticado } from '@/src/shared/Service'
import { OperadoresResponse, FiltroBuscaOperadores, ResponseRotasPerfil, ResponseGetPerfis } from './operadoresDTO';
import { normalizarListaTexto } from '@/src/shared/utils/normalizarListaTexto';

type OperadoresResponseApi = Omit<OperadoresResponse, 'dados'> & {
    dados: Array<Omit<OperadoresResponse['dados'][number], 'listaPerfis'> & {
        listaPerfis: unknown;
    }>;
};

export async function servicoGetOperadores(
    token: string,
    perfilAtivo: string,
    filtros: FiltroBuscaOperadores
): Promise<OperadoresResponse>{
    const resposta = await fetchAutenticado<OperadoresResponseApi>(
        "GET",
        '/operadores/dados',
        token,
        perfilAtivo,
        filtros
    );

    return {
        ...resposta,
        dados: resposta.dados.map((operador) => ({
            ...operador,
            listaPerfis: normalizarListaTexto(operador.listaPerfis)
        }))
    };
}

export async function servicoGetRotas(
    token: string,
    perfilAtivo: string
): Promise<ResponseRotasPerfil> {
    return fetchAutenticado(
        "GET",
        'operadores/rotas',
        token,
        perfilAtivo
    )
}

export async function servicoGetPerfis(
    token: string
): Promise<ResponseGetPerfis> {
    return fetchAutenticado(
        "GET",
        'operadores/perfis',
        token
    )
}
