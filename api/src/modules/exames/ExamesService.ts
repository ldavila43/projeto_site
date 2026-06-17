import { buscarDados, buscarTotal } from './ExamesRepostitory'
import { RequestExames, ExamesDTO, ExamesMetadados } from './ExamesDTO'

export async function buscaExames(dadosReq: RequestExames): Promise<ExamesDTO>{
    const [resultadoContagem, resultadoDados] = await Promise.all(
        [buscarTotal(dadosReq.idPaciente, dadosReq.idProfissional, dadosReq.protocolo, dadosReq.tipoExame, dadosReq.nomePaciente, dadosReq.nomeProfissional),
        buscarDados(dadosReq.idPaciente, dadosReq.idProfissional, dadosReq.protocolo, dadosReq.tipoExame, dadosReq.limit, dadosReq.offset, dadosReq.nomePaciente, dadosReq.nomeProfissional)]
    );

    let limite;

    if (!dadosReq.limit){
        limite = 10;
    } else {
        limite = dadosReq.limit;
    }

    const totalRegistros = Number(resultadoContagem)
    const totalPaginas = Math.ceil(totalRegistros / limite);

    const metadados: ExamesMetadados = {
        totalRegistros: totalRegistros,
        totalPaginas: totalPaginas
    }

    const examesDTO: ExamesDTO = {
        dados: resultadoDados,
        metadados: metadados
    }

    return examesDTO;
    }