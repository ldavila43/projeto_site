
import { StatusGenerico } from '@/src/shared/utils/StatusEnum';

export interface FiltrosGetCategorias {
    idCategoria?: string,
    nome?: string,
    status?: StatusGenerico | '',
    limit?: string,
    page?: string
}

export interface CategoriaExame {
    idCategoria: number,
    descricao: string,
    texto: string | null,
    status: StatusGenerico
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ResponseGetCategorias {
    categorias: CategoriaExame[],
    metadados: Metadados
}
