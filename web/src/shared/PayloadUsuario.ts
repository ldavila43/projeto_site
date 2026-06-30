export interface Perfil {
    id: number,
    nome: string
}

export interface PayloadUsuario {
    id: string;
    nome: string,
    perfis: Perfil[]
}
