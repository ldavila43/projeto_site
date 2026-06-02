import pool from '../config/DatabaseConfig'


export async function buscaAnos() {
    const busca = await pool.query(
        `
        select distinct to_char(solicitacoes_exame.data_solicitacao, 'YYYY') as ano
        from solicitacoes_exame
        order by ano desc
        `
    )
    const anosDisponiveis: string[] = busca.rows.map(
        row => row.ano
    )

    return anosDisponiveis
}