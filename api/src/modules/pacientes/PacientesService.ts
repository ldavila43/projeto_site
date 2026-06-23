import { buscaPacientesNome, buscaMetadadosPacientes, buscaPorCPF, cadastraPaciente } from './PacientesRepository';
import { PacientesMetadados, PacienteResponse, PacienteRequest, ReqCadastroDTO } from './pacienteDTO';
import ApiError from '../../errors/ApiErrors'

export async function buscaPacientes(request: PacienteRequest): Promise<PacienteResponse> {
    const [total, pacientes] = await Promise.all(
        [buscaMetadadosPacientes(request.nome, request.idProfissional),
        buscaPacientesNome(request.nome, request.idProfissional, request.limit, request.offset)]
    );

    let limite;

    if (!request.limit){
        limite = 10;
    } else {
        limite = request.limit;
    }

    const totalRegistros = Number(total)
    const totalPaginas = Math.ceil(totalRegistros / limite);

    const metadados: PacientesMetadados = {
        totalRegistros: totalRegistros,
        totalPaginas: totalPaginas
    }
    const pacienteResponse: PacienteResponse = {
        metadados: metadados,
        pacientes: pacientes
    }

    return pacienteResponse;
}

export async function cadastraPacientes(dadosCadastro: ReqCadastroDTO) {
    const documentoIdentificacao = sanitizeDocumento(dadosCadastro.documentoIdentificacao);
    const email: string = sanitizeEmail(dadosCadastro.email);
    const dataNasicmento: Date = new Date(dadosCadastro.nascimento);
    
    const telefone = sanitizeTelefone(dadosCadastro.telefone);

    if (isNaN(dataNasicmento.getTime())) {
        throw new ApiError(400, 'Data de nascimento inválida');
    }

    try {
        const resultado = await cadastraPaciente(
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
            dadosCadastro.estadoCivil,
            dadosCadastro.complemento,
            dadosCadastro.profissao,
            dadosCadastro.sexo,
            dadosCadastro.etnia,
        )

        if (resultado.status == 'ja_paciente') {
            throw new ApiError(409, 'Paciente já cadastrado')
        }

        return true;

    } catch(erro){
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