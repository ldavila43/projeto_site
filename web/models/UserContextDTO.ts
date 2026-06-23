import { PerfilID } from '@/utils/PerfisEnum'

export default interface UserContextDTO {
    id: string,
    nome: string,
    perfisDisponiveis: PerfilID[]
    perfilAtivo: PerfilID | null
}