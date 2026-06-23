import pool from '../../config/DatabaseConfig';
import { Exames, ExamesMetadados } from './ExamesDTO'


export async function buscaPorId (idExame: number, idPaciente?: string, idProfissional?: string): Promise<Exames>{
    console.log(idExame, idPaciente, idProfissional )
    const busca = await pool.query(
        `
        select
            exames.id_exame as id_exame,
            exames.protocolo as protocolo,
            pac.nome as nome_paciente,
            tipos_exame.descricao as tipo_exame,
            categorias_exame.id_categoria as categoria_exame,
            pac.documento_identificacao as documento_paciente,
            prof.nome as nome_profissional,
            solicitacoes_exame.data_solicitacao as data_solicitacao,
            exames.status as status_exame
        from exames
        join tipos_exame
            on exames.id_tipo_exame = tipos_exame.id_tipo_exame
        left join categorias_exame
            on tipos_exame.id_categoria_exame = categorias_exame.id_categoria
        join solicitacoes_exame
            on exames.id_solicitacao = solicitacoes_exame.id_solicitacao
        join pacientes
            on solicitacoes_exame.id_paciente = pacientes.id_paciente
        join profissionais_saude
            on solicitacoes_exame.id_profissional_saude = profissionais_saude.id_profissional
        join pessoas pac
            on pacientes.id_pessoa = pac.id_pessoa
        join pessoas prof
            on profissionais_saude.id_pessoa = prof.id_pessoa
        where exames.id_exame = $1
        and pac.id_pessoa = coalesce($2, pac.id_pessoa)
        and prof.id_pessoa = coalesce($3, prof.id_pessoa)
        `, [idExame, idPaciente, idProfissional]
    )

    const dadosExame = busca.rows[0]
    const exame: Exames = {
        idExame: dadosExame.id_exame,
        protocolo: dadosExame.protocolo,
        nomePaciente: dadosExame.nome_paciente,
        tipoExame: dadosExame.tipo_exame,
        categoriaExame: dadosExame.categoria_exame,
        documentoPaciente: dadosExame.documento_paciente,
        nomeProfissional: dadosExame.nome_profissional,
        dataSolicitacao: dadosExame.data_solicitacao,
        status: dadosExame.status_exame
    }

    return exame;
}
export async function buscarDados(
    idPaciente?: string,
    idProfissional?: string,
    protocolo?: string,
    tipoExame?: string,
    limit?: number,
    offset?: number,
    nomePaciente?: string,
    nomeProfissional?: string,
    ) {

    const busca = await pool.query(
        `
        select
            exames.id_exame as id_exame,
            exames.protocolo as protocolo,
            pac.nome as nome_paciente,
            tipos_exame.descricao as tipo_exame,
            categorias_exame.id_categoria as categoria_exame,
            pac.documento_identificacao as documento_paciente,
            prof.nome as nome_profissional,
            solicitacoes_exame.data_solicitacao as data_solicitacao,
            exames.status as status_exame
        from exames
        join tipos_exame
            on exames.id_tipo_exame = tipos_exame.id_tipo_exame
        left join categorias_exame
            on tipos_exame.id_categoria_exame = categorias_exame.id_categoria
        join solicitacoes_exame
            on exames.id_solicitacao = solicitacoes_exame.id_solicitacao
        join pacientes
            on solicitacoes_exame.id_paciente = pacientes.id_paciente
        join profissionais_saude
            on solicitacoes_exame.id_profissional_saude = profissionais_saude.id_profissional
        join pessoas pac
            on pacientes.id_pessoa = pac.id_pessoa
        join pessoas prof
            on profissionais_saude.id_pessoa = prof.id_pessoa
        where pac.id_pessoa = coalesce($1, pac.id_pessoa)
        and prof.id_pessoa = coalesce($2, prof.id_pessoa)
        and ($3::text is null or tipos_exame.descricao ilike '%' || $3 || '%')
        and ($4::text is null or exames.protocolo ilike '%' || $4 || '%')
        and ($7::text is null or pac.nome ilike '%' || $7 || '%')
        and ($8::text is null or prof.nome ilike '%' || $8 || '%')
        order by solicitacoes_exame.data_solicitacao desc
        limit coalesce($5, 10)
        offset coalesce($6, 0);
        `,
        [idPaciente, idProfissional, tipoExame, protocolo, limit, offset, nomePaciente, nomeProfissional]
    );

    const exames: Exames[] = busca.rows.map(row => ({
        idExame: row.id_exame,
        protocolo: row.protocolo,
        nomePaciente: row.nome_paciente,
        tipoExame: row.tipo_exame,
        categoriaExame: row.categoria_exame,
        documentoPaciente: row.documento_paciente,
        nomeProfissional: row.nome_profissional,
        dataSolicitacao: row.data_solicitacao,
        status: row.status_exame
        })
    )

    return exames;
}

export async function buscarTotal(
    idPaciente?: string,
    idProfissional?: string,
    protocolo?: string,
    tipoExame?: string,
    nomePaciente?: string,
    nomeProfissional?: string
    ): Promise<number> {
    const busca = await pool.query(
        `
        select
            count(*) as total
        from exames
        join tipos_exame
            on exames.id_tipo_exame = tipos_exame.id_tipo_exame
        join solicitacoes_exame
            on exames.id_solicitacao = solicitacoes_exame.id_solicitacao
        join pacientes
            on solicitacoes_exame.id_paciente = pacientes.id_paciente
        join profissionais_saude
            on solicitacoes_exame.id_profissional_saude = profissionais_saude.id_profissional
        join pessoas pac
            on pacientes.id_pessoa = pac.id_pessoa
        join pessoas prof
            on profissionais_saude.id_pessoa = prof.id_pessoa
        where pac.id_pessoa = coalesce($1, pac.id_pessoa)
        and prof.id_pessoa = coalesce($2, prof.id_pessoa)
        and ($3::text is null or tipos_exame.descricao ilike '%' || $3 || '%')
        and ($4::text is null or exames.protocolo ilike '%' || $4 || '%')
        and ($5::text is null or pac.nome ilike '%' || $5 || '%')
        and ($6::text is null or prof.nome ilike '%' || $6 || '%')
        `,
        [idPaciente, idProfissional, tipoExame, protocolo, nomePaciente, nomeProfissional]
    )

    const total = busca.rows[0].total

    return total;
}

export async function buscaExamePorId(idExame: number, idPaciente?: string, idProfissional?: string) {
    const busca = pool.query(
        `
        select
            exames.protocolo protocolo,
            tipos_exame.id_tipo_exame id_tipo_exame,
            tipos_exame.descricao nome_tipo_exame,
            pac.nome nome_paciente,
            pac.data_nascimento data_nascimento_paciente,
            pac.documento_identificacao documento_paciente,
            prof.nome nome_profissional
        from exames
        join tipos_exame
            on exames.id_tipo_exame = tipos_exame.id_tipo_exame
        join solicitacoes_exame
        on exames.id_solicitacao = solicitacoes_exame.id_solicitacao
        join pacientes
            on solicitacoes_exame.id_paciente = pacientes.id_paciente
        join pessoas pac
            on pacientes.id_pessoa = pac.id_pessoa
        left join profissionais_saude
            on profissionais_saude.id_profissional = solicitacoes_exame.id_profissional_saude
        left join pessoas prof
            on prof.id_pessoa = profissionais_saude.id_pessoa
        where exames.id_exame = $1
        and pac.id_pessoa = coalesce($2, pac.id_pessoa)
        and prof.id_pessoa = coalesce($3, prof.id_pessoa)
        `, [idExame, idPaciente, idProfissional]
    )
}