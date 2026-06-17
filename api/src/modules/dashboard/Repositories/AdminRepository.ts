import pool from '../../../config/DatabaseConfig'
import { Estatisticas, SolicitacoesPeriodo } from '../DTO/DashAdminDTO'



export async function buscaOperadoresAtivos() {
    const busca = await pool.query(
        `
        select sum(
                case
                    when operadores_perfis.id_perfil in (0, 2) then 1
                    else 0
                end
            ) as colaboradores,
            sum(
                case
                    when operadores_perfis.id_perfil not in (0, 2) then 1
                    else 0
                end
            ) as usuarios
        from operadores
        join operadores_perfis
            on operadores.id_operador = operadores_perfis.id_operador
        where status = 'ATIVO';
        `
    )

    const estatisticasUsuarios: Estatisticas = {
        colaboradores: Number(busca.rows[0].colaboradores),
        usuarios: Number(busca.rows[0].usuarios)
    };

    return estatisticasUsuarios;
}

export async function buscaSolicitacoesPorMes(ano: string | undefined): Promise<SolicitacoesPeriodo[]>{
    const busca = await pool.query(
        `
        WITH ano_ref AS (
            SELECT COALESCE($1, to_char(current_date, 'YYYY')) AS ano
        ),
        meses AS (
            SELECT to_char(serie, 'YYYY-MM') AS periodo
            FROM ano_ref,
                generate_series(
                    (ano_ref.ano || '-01-01')::date,
                    LEAST(
                        (ano_ref.ano || '-12-01')::date,
                        date_trunc('month', current_date) - interval '1 month'
                    ),
                    '1 month'
                ) AS serie
        ),
        contagem AS (
            SELECT
                to_char(data_solicitacao, 'YYYY-MM') AS periodo,
                COUNT(*) AS solicitacoes
            FROM solicitacoes_exame
            WHERE to_char(data_solicitacao, 'YYYY') = (SELECT ano FROM ano_ref)
            GROUP BY periodo
        )
        SELECT
            m.periodo,
            COALESCE(c.solicitacoes, 0) AS solicitacoes
        FROM meses m
        LEFT JOIN contagem c ON c.periodo = m.periodo
        ORDER BY m.periodo;
        `,
        [ano]
    )

    const solicitacoesPeriodo: SolicitacoesPeriodo[] = busca.rows.map(row => ({
        periodo: row.periodo,
        solicitacoes: Number(row.solicitacoes)
    }));

    return solicitacoesPeriodo;
}