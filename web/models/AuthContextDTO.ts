import { PerfilID } from '@/utils/PerfisEnum'

export default interface AuthContextDTO {
    id: string,
    nome: string,
    perfisDisponiveis: PerfilID[]
    perfilAtivo: PerfilID | null,
    alterarPerfil: (novoPerfil: string) => void
}