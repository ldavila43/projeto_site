import {Perfil} from '../../shared/PayloadUsuario'
import { PerfilID } from '@/src/shared/utils/PerfisEnum'

export default interface UserContextDTO {
    id: string,
    nome: string,
    perfisDisponiveis: Perfil[]
    perfilAtivo: PerfilID | null
}
