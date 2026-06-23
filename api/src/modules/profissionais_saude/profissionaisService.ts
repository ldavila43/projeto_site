import { buscaProfissionaisNome, buscaMetadadosProfissionais, buscaPorCPF, cadastraProfissional } from './profissionaisRepository';
import { ProfissionaisMetadados, ProfissionaisResponse, ProfissionaisRequest, ReqCadastroDTO } from './profissionaisDTO';
import ApiError from '../../errors/ApiErrors'

export async function buscaProfissionais(request: ProfissionaisRequest): Promise<ProfissionaisResponse> {
    const [total, profissionais] = await Promise.all(
        [buscaMetadadosProfissionais(request.nome),
        buscaProfissionaisNome(request.nome, request.limit, request.offset)]
    );

    let limite;

    if (!request.limit){
        limite = 10;
    } else {
        limite = request.limit;
    }

    const totalRegistros = Number(total)
    const totalPaginas = Math.ceil(totalRegistros / limite);

    const metadados: ProfissionaisMetadados = {
        totalRegistros: totalRegistros,
        totalPaginas: totalPaginas
    }
    const pacienteResponse: ProfissionaisResponse = {
        metadados: metadados,
        profissionais: profissionais
    }

    return pacienteResponse;
}

export async function cadastraProfissionais(dadosCadastro: ReqCadastroDTO) {
    const documentoIdentificacao = sanitizeDocumento(dadosCadastro.documentoIdentificacao);
    const email: string = sanitizeEmail(dadosCadastro.email);
    const dataNasicmento: Date = new Date(dadosCadastro.nascimento);
    
    const telefone = sanitizeTelefone(dadosCadastro.telefone);

    if (isNaN(dataNasicmento.getTime())) {
        throw new ApiError(400, 'Data de nascimento inválida');
    }

    try {
        const resultado = await cadastraProfissional(
            dadosCadastro.nome,
            documentoIdentificacao,
            dataNasicmento,
            email,
            telefone,
            dadosCadastro.tipoContato,
            dadosCadastro.cep,
            dadosCadastro.logradouro,
            dadosCadastro.numero,
            dadosCadastro.bairro,
            dadosCadastro.tipoEndereco,
            dadosCadastro.idCidade,
            dadosCadastro.idProfissao,
            dadosCadastro.complemento,
            dadosCadastro.sexo,
            dadosCadastro.etnia,
        )

        if (resultado.status == 'ja_profissional') {
            throw new ApiError(409, 'Profissional já cadastrado')
        }

        return true;

    } catch(erro){
        console.log(erro)
        if (erro instanceof ApiError) {
            throw erro;
        }
        throw new ApiError(500, 'Erro no cadastro');
    }
}

function sanitizeDocumento(doc: string): string {
    return doc.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function sanitizeTelefone(tel: string): string {
    const hasPlus = tel.trimStart().startsWith('+');
    const digits = tel.replace(/\D/g, '');
    return hasPlus ? `+${digits}` : digits;
}

function sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
}