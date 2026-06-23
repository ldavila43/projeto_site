import pool from '../../config/DatabaseConfig'
import { TiposExameDTO, TiposExameResponse } from './resultados/DTO/TiposExameDTO'


export async function buscaTipoExameNome(nome: string): Promise<TiposExameResponse> {
    const busca = await pool.query (
        `
        select
            tipos_exame.id_tipo_exame
            tipos_exame.descricao
        from tipos_exame
        where ($1 is null or tipos_exame.descricao ilike '%' || $1 || '%');
        `,
        [nome]
    )

    const tiposExame: TiposExameDTO[] = busca.rows.map(tipoExame => ({
        idTipoExame: tipoExame.id_tipo_exame,
        nome: tipoExame.descricao
    }))

    return {
        tiposExame
    }
}