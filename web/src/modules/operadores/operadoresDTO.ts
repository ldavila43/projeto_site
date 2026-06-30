export interface FiltroBuscaOperadores {
    nomeOperador?: string,
    documentoOperador?: string,
    status?: string,
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
    label: string,
    href: string
}

export interface ResponseRotasPerfil {
    rotas: Rota[]
}

export interface Perfil {
    id: number,
    nome: string
}

export interface ResponseGetPerfis {
    perfis: Perfil[]
}