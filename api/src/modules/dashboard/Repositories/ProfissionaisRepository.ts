import pool from '../../../config/DatabaseConfig';
import { ExamesPeriodo, Estatisticas } from '../DTO/DashProfisisonalDTO'

export async function buscaEstatisticasDashboardProf(idPessoa: string): Promise<Estatisticas> {
    const busca = await pool.query(
        `
        select
            count(*) as total_pacientes,
            sum (
                case
                    when exames.status = 'CONCLUÍDO' then 1 else 0
                end
            ) as analises_completas,
            sum (
                case
                    when exames.status <> 'CONCLUÍDO' then 1 else 0
                end
            ) as analises_pendentes
        from pacientes
        join solicitacoes_exame
            on solicitacoes_exame.id_paciente = pacientes.id_paciente
        join exames
            on exames.id_solicitacao = solicitacoes_exame.id_solicitacao
        join profissionais_saude
            on solicitacoes_exame.id_profissional_saude = profissionais_saude.id_profissional
        join pessoas
            on profissionais_saude.id_pessoa = pessoas.id_pessoa
        where pessoas.id_pessoa = $1
        `,
        [idPessoa]
    );

    const estatisticas: Estatisticas = {
        totalPacientes: Number(busca.rows[0].total_pacientes),
        analisesCompletas: Number(busca.rows[0].analises_completas),
        analisesPendentes: Number(busca.rows[0].analises_pendentes)
    }

    return estatisticas;
}

export async function bucaExamesDashProf(idProfissional: string, idPaciente?: string, dataIni?: Date, dataFim?: Date): Promise<ExamesPeriodo[]> {
    const busca = await pool.query (
        `
        with contagem_exames as (
            select
                to_char(solicitacoes_exame.data_solicitacao, 'YYYY-Mon') as periodo,
                tipos_exame.descricao tipo_exame,
                count(exames.id_solicitacao) contagem
            from solicitacoes_exame
            join exames
                on exames.id_solicitacao = solicitacoes_exame.id_solicitacao
            join tipos_exame
                on exames.id_tipo_exame = tipos_exame.id_tipo_exame
            join profissionais_saude
                on solicitacoes_exame.id_profissional_saude = profissionais_saude.id_profissional
            join pessoas prof
                on profissionais_saude.id_pessoa = prof.id_pessoa
            join pacientes
                on solicitacoes_exame.id_paciente = pacientes.id_paciente
            join pessoas pac
                on pacientes.id_pessoa = pac.id_pessoa
            where prof.id_pessoa = $1
            and pac.id_pessoa = coalesce($2, pacientes.id_pessoa)
            and data_solicitacao
                between
                    coalesce(
                            coalesce($3, date_trunc('year', current_date))
                            , to_date('01/01/1900', 'dd/mm/yyyy')
                    )
                and
                    coalesce(
                            coalesce($4, date_trunc('month', current_date)),
                            to_date('31/12/2999', 'dd/mm/yyyy')
                )
            group by
                tipos_exame.descricao,
                solicitacoes_exame.data_solicitacao
            order by date_trunc('month', data_solicitacao), tipos_exame.descricao
        )
        select
            periodo,
            json_agg(
                json_build_object(
                    'tipo_exame', tipo_exame,
                    'contagem', contagem
                )
            ) as exames
        from contagem_exames
        group by periodo
        order by periodo;
        `,
        [idProfissional, idPaciente, dataIni, dataFim]
    )
    const examesPeriodo: ExamesPeriodo[] = busca.rows.map(row => ({
        periodo: row.periodo,
        exames: row.exames.map((
            exame: { tipo_exame: string; contagem: string }) => ({
            tipoExame: exame.tipo_exame,
            contagem: Number(exame.contagem)
        }))
    }))

    return examesPeriodo;
}
