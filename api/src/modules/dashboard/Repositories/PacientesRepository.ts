import pool from '../../../config/DatabaseConfig'
import { Estatisticas, Exames } from '../DTO/DashPacientesDTO'

export async function buscaEstatisticasDashboard(idPessoa: string): Promise<Estatisticas> {
    const busca = await pool.query(
        `
        select
            count(*) as total_exames,
            sum(case when exames.status = 'CONCLUÍDO' then 1 else 0 end) as exames_concluidos
        from exames
        join solicitacoes_exame
            on exames.id_solicitacao = solicitacoes_exame.id_solicitacao
        join pacientes
            on solicitacoes_exame.id_paciente = pacientes.id_paciente
        join pessoas
            on pessoas.id_pessoa = pacientes.id_pessoa
        where pessoas.id_pessoa = $1;
        `,
        [idPessoa]
    );

    const estatisticas: Estatisticas = {
        total: Number(busca.rows[0].total_exames),
        concluidos: Number(busca.rows[0].exames_concluidos)
    }

    return estatisticas;
}

export async function bucaExamesDash(idPessoa: string): Promise<Exames[]> {
    const busca = await pool.query (
        `
        select
            exames.protocolo protocolo,
            tipos_exame.descricao tipo_exame,
            exames.status status,
            solicitacoes_exame.data_solicitacao data_solicitacao
        from exames
        join tipos_exame
            on exames.id_tipo_exame = tipos_exame.id_tipo_exame
        join solicitacoes_exame
            on exames.id_solicitacao = solicitacoes_exame.id_solicitacao
        join pacientes
            on solicitacoes_exame.id_paciente = pacientes.id_paciente
        join pessoas
            on pessoas.id_pessoa = pacientes.id_pessoa
        where pessoas.id_pessoa = $1
        order by data_solicitacao desc
        limit 5
        `,
        [idPessoa]
    )

    const exames: Exames[] = busca.rows.map(row => ({
        protocolo: row.protocolo,
        tipoExame: row.tipo_exame,
        status: row.status,
        dataSolicitacao: row.data_solicitacao
    }))

    return exames;
}

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