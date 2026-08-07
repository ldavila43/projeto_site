
import { StatusGenerico } from '@/src/shared/utils/StatusEnum';


export interface TipoExame {
    idTipoExame: number,
    descricao: string,
    status: StatusGenerico,
    idCategoriaExame: number | null,
    categoriaExame: string | null
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface ResponseGetTiposExame {
    metadados: Metadados,
    tiposExame: TipoExame[]
}

export interface RequestGetTiposExame {
    descricao?: string,
    status?: StatusGenerico | '',
    categoriaExame?: string,
    limit?: string,
    page?: string
}

export interface RequestPostTipoExame {
    nome: string,
    caminhoImagem?: string,
    caminhoIcone?: string,
    caminhoLogo?: string,
    status?: StatusGenerico,
    idCategoriaExame?: number
}
