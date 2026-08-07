import { StatusGenerico } from '@/src/shared/utils/StatusEnum';

export interface FiltroBuscaOperadores {
    nomeOperador?: string,
    documentoOperador?: string,
    status?: StatusGenerico | '',
    idPerfil?: string,
    limit?: string,
    offset?: string,
    page?: string
}

export interface Operador {
    idOperador: string,
    nomeOperador: string,
    documentoOperador: string,
    statusOperador: string,
    listaPerfis: string[]
}

export interface Metadados {
    totalRegistros: number,
    totalPaginas: number
}

export interface OperadoresResponse {
    dados: Operador[]
    metadados: Metadados
}

export interface Rota {
    idRota: string,
    label: string,
    href: string,
    subMenus?: Rota[]
}

export interface ResponseRotasPerfil {
    rotas: Rota[]
}

export interface Perfil {
    id: number,
    nome: string
}

export interface ResponseGetPerfis {
    dados: {
        perfis: Perfil[]
    }
}
