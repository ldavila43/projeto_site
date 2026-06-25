import { PerfilID } from '@/src/shared/utils/PerfisEnum'

export default interface UserContextDTO {
    id: string,
    nome: string,
    perfisDisponiveis: PerfilID[]
    perfilAtivo: PerfilID | null
}