import pool from '../../../../../config/DatabaseConfig';


export async function buscaCalculoSeveridadePersistencia(idExame?: number, idPaciente?: string, idProfissional?: string) {
    const busca = await pool.query(
        `
        select 
            class.tipo,
            sum(abundancia)
        from resultados_virulencia_resistencia res
        join classes_virulencia_resistencia class
            on res.id_classe = class.id_classe
        join exames
            on res.id_exame = exames.id_exame
        join solicitacoes_exame
            on solicitacoes_exame.id_solicitacao = exames.id_solicitacao
        join pacientes
            on pacientes.id_paciente = solicitacoes_exame.id_paciente
        join pessoas pac
            on pacientes.id_pessoa = pac.id_pessoa
        left join profissionais_saude
            on solicitacoes_exame.id_profissional_saude = profissionais_saude.id_profissional
        join pessoas prof
            on profissionais_saude.id_pessoa = prof.id_pessoa
        where res.id_exame = $1
        and pac.id_pessoa = coalesce($2, pac.id_pessoa)
        and prof.id_pessoa = coalesce($3, prof.id_pessoa)
        group by class.tipo;
        `, [idExame, idPaciente, idProfissional]
    )
}