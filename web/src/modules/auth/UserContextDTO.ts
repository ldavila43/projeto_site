import {Perfil} from '../../shared/PayloadUsuario'

export default interface UserContextDTO {
    id: string,
    nome: string,
    perfisDisponiveis: Perfil[]
    perfilAtivo?: number
}