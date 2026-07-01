import { fetchAutenticado } from '@/src/shared/Service'
import { ResponseGetCategorias, FiltrosGetCategorias } from '@/src/modules/categorias_exame/CategoriasExameDTO'


export async function servicoGetCategorias(
    token: string,
    filtros: FiltrosGetCategorias,
    perfilAtivo: string,
): Promise<ResponseGetCategorias> {
    return fetchAutenticado(
        '/categorias-exame/dados',
        token,
        perfilAtivo,
        filtros
    )
}