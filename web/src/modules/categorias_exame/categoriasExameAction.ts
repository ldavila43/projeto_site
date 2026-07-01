'use server'
import { cookies } from 'next/headers';
import { servicoGetCategorias } from '@/src/modules/categorias_exame/categoriasExameService';
import { CategoriaExame, ResponseGetCategorias, FiltrosGetCategorias } from '@/src/modules/categorias_exame/CategoriasExameDTO';

export async function executarComSessao<T>(
    funcaoServico: (
        token: string,
        filtros: FiltrosGetCategorias,
        perfilAtivo: string
    ) => Promise<T>,
    filtros: FiltrosGetCategorias
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const perfilAtivo = cookieStore.get('x-perfil-ativo')?.value ?? ''
    if (!token) {
        throw new Error("Sem token válido");
    }

    return funcaoServico(token, filtros, perfilAtivo);
}
;
export async function buscarDadosCategoriasExames (
    filtros: FiltrosGetCategorias
): Promise<ResponseGetCategorias> {
    return executarComSessao(servicoGetCategorias, filtros);
};

