import { PerfilID } from '@/src/shared/utils/PerfisEnum'
import { Perfil } from '@/src/shared/PayloadUsuario'

export default interface AuthContextDTO {
    id: string,
    nome: string,
    perfisDisponiveis: Perfil[]
    perfilAtivo: PerfilID | null,
    alterarPerfil: (novoPerfil: string) => void
}
