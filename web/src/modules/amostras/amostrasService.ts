import { fetchAutenticado } from '@/src/shared/Service';
import { normalizarListaTexto } from '@/src/shared/utils/normalizarListaTexto';
import { Amostra, FiltrosAmostras, ResponseAmostras } from './AmostrasDTO';

type AmostraApi = Omit<Amostra, 'protocolosVinculados'> & {
    protocolosVinculados: unknown;
};

export async function servicoGetAmostras(
    token: string,
    perfilAtivo: string,
    filtros: FiltrosAmostras
): Promise<ResponseAmostras> {
    const resposta = await fetchAutenticado<
        Omit<ResponseAmostras, 'amostras'> & { amostras: AmostraApi[] }
    >('GET', '/amostras/dados', token, perfilAtivo, filtros);

    return {
        ...resposta,
        amostras: resposta.amostras.map((amostra) => ({
            ...amostra,
            protocolosVinculados: normalizarListaTexto(amostra.protocolosVinculados)
        }))
    };
}
