import pool from '../../../config/DatabaseConfig';
import { TiposExame, CardPacientes, CardProfissionais } from '../DTO/DashColaboradorDTO';

export async function buscaEstatisticasPacientes(): Promise<CardPacientes> {
    const busca = await pool.query(
        `
        SELECT
            COUNT(*) FILTER (WHERE criado_em >= date_trunc('month', current_date)) AS mes_atual,
            COUNT(*) FILTER (WHERE criado_em < date_trunc('month', current_date)) AS mes_anterior
        FROM pacientes
        JOIN pessoas
            ON pessoas.id_pessoa = pacientes.id_pessoa
        WHERE criado_em >= date_trunc('month', current_date) - interval '1 month'
        AND criado_em < date_trunc('day', current_date) + interval '1 day';
        `
    )

    return {
        mesAtual: Number(busca.rows[0].mes_atual),
        mesAnterior: Number(busca.rows[0].mes_anterior)
    }
}

export async function buscaEstatisticasProfissionais(): Promise<CardProfissionais> {
    const busca = await pool.query(
        `
        SELECT
            COUNT(*) FILTER (WHERE criado_em >= date_trunc('month', current_date)) AS mes_atual,
            COUNT(*) FILTER (WHERE criado_em < date_trunc('month', current_date)) AS mes_anterior
        FROM profissionais_saude
        JOIN pessoas
            ON pessoas.id_pessoa = profissionais_saude.id_pessoa
        WHERE criado_em >= date_trunc('month', current_date) - interval '1 month'
        AND criado_em < date_trunc('day', current_date) + interval '1 day';
        `
    )

    return {
        mesAtual: Number(busca.rows[0].mes_atual),
        mesAnterior: Number(busca.rows[0].mes_anterior)
    }
}

export async function buscaEstatisticasSolicitacoes(): Promise<CardProfissionais> {
    const busca = await pool.query(
        `
        SELECT
            COUNT(*) FILTER (WHERE solicitacoes_exame.data_solicitacao >= date_trunc('month', current_date)) AS mes_atual,
            COUNT(*) FILTER (WHERE solicitacoes_exame.data_solicitacao < date_trunc('month', current_date)) AS mes_anterior
        FROM solicitacoes_exame
        WHERE solicitacoes_exame.data_solicitacao >= date_trunc('month', current_date) - interval '1 month'
        AND solicitacoes_exame.data_solicitacao < date_trunc('day', current_date) + interval '1 day';
        `
    )

    return {
        mesAtual: Number(busca.rows[0].mes_atual),
        mesAnterior: Number(busca.rows[0].mes_anterior)
    }
}

export async function buscaEstatisticasExame(): Promise<CardProfissionais> {
    const busca = await pool.query(
        `
        SELECT
            COUNT(*) FILTER (WHERE exames.data_emissao >= date_trunc('month', current_date)) AS mes_atual,
            COUNT(*) FILTER (WHERE exames.data_emissao < date_trunc('month', current_date)) AS mes_anterior
        FROM exames
        WHERE exames.data_emissao >= date_trunc('month', current_date) - interval '1 month'
        AND exames.data_emissao < date_trunc('day', current_date) + interval '1 day';
        `
    )

    return {
        mesAtual: Number(busca.rows[0].mes_atual),
        mesAnterior: Number(busca.rows[0].mes_anterior)
    }
}

export async function buscaEstatisticasTipoExame(dataIni?: Date, dataFim?: Date, limite?: number): Promise<TiposExame[]>{
    const busca = await pool.query(
        `                
        select
            tipos_exame.id_tipo_exame,
            tipos_exame.descricao,
            count(*)
        from exames
        join tipos_exame
            on exames.id_tipo_exame = tipos_exame.id_tipo_exame
        where
            exames.data_emissao between coalesce($1, to_date('01/01/1900', 'dd/mm/yyyy')) and coalesce($2, current_date)
        group by
            tipos_exame.descricao,
            tipos_exame.id_tipo_exame
        order by count(*)
        limit coalesce($3, 5);
        `, [dataIni, dataFim, limite]
    )
    const tiposExames: TiposExame[] = busca.rows.map(
        tipoExame => ({
            idTipoExame: tipoExame.id_tipo_exame,
            nomeTipoExame: tipoExame.descricao,
            contagem: tipoExame.contagem
        })
    )
    
    return tiposExames;
}