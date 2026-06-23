import pool from '../../config/DatabaseConfig';
import UsuarioModel from './UsuarioModel'

export async function buscaPorCpf(documento: string) {
    const busca = await pool.query(
        `
            select exists (
                select 1
                from pessoas
                where documento_identificacao = $1
        ) as existe
        `,
        [documento]
    )

    return busca.rows[0].existe;
}

export async function criarConta(usuario: UsuarioModel){
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const insert_pessoas = await client.query(
            `
                insert into pessoas(nome, data_nascimento, documento_identificacao, sexo, etnia)
                values ($1, $2, $3, $4, $5)
                returning id_pessoa
            `,
            [
                usuario.nome,
                usuario.dataNascimento,
                usuario.documentoIdentificacao,
                usuario.sexo,
                usuario.etnia
            ]
        )
        const id_pessoa = insert_pessoas.rows[0].id_pessoa;

        const insert_operadores = await client.query(
            `
                insert into operadores(id_pessoa)
                values ($1)
                returning id_operador
            `,
            [id_pessoa]
        )

        const id_operador = insert_operadores.rows[0].id_operador;

        await client.query(
            `
                insert into operadores_credenciais(id_operador, senha_hash)
                values($1, $2)
            `,
            [
                id_operador,
                usuario.senhaHash
            ]
        )

        await client.query(
            `
                insert into operadores_perfis(id_operador, id_perfil)
                values($1, $2)
            `,
            [
                id_operador,
                0
            ]
        )

        await client.query('COMMIT')

        return true;

    } catch (erro) {
        await client.query('ROLLBACK')
        throw(erro);
    } finally {
        client.release()
    }
}

export async function buscarCredenciaisPorDocumento(documento: string) {
    const busca = await pool.query(
        `
            select
                pessoas.id_pessoa,
                operadores_credenciais.senha_hash as senha_hash,
                array_agg(perfis.id_perfil) as perfis,
                pessoas.nome as nome,
                operadores.*
            from pessoas
            join operadores
                on operadores.id_pessoa = pessoas.id_pessoa
            join operadores_credenciais
                on operadores_credenciais.id_operador = operadores.id_operador
            join operadores_perfis
                on operadores_perfis.id_operador = operadores.id_operador
            join perfis
                on operadores_perfis.id_perfil = perfis.id_perfil
            where pessoas.documento_identificacao = $1
            group by
                pessoas.id_pessoa,
                operadores.id_operador,
                operadores_credenciais.senha_hash,
                pessoas.nome
        `,
        [documento]
    );

    return busca.rows[0]
}