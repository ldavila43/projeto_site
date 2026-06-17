import { Request, Response } from 'express'
import { buscaExames } from './ExamesService'
import { RequestExames } from './ExamesDTO'

export async function controladorExamesPacientes(req: Request, res: Response) {
    try {

        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;

        const offsetCalculado = (page - 1) * limit;

        const requestExames: RequestExames = {
            idPaciente: req.usuarioLogado!.id,
            tipoExame: req.query.tipoExame as string | undefined,
            protocolo: req.query.protocolo as string | undefined,
            limit: limit,
            offset: offsetCalculado
        };

        const dadosExames  = await buscaExames(requestExames);
        return res.status(200).json(dadosExames)
    } catch {
        return res.status(500).json({
            error: 'Erro ao buscar exames'
        });
    }
}

export async function controladorExamesProfissionais(req: Request, res: Response) {
    try {

        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;
        const nomePaciente = req.query.nomePaciente as string | undefined;

        const offsetCalculado = (page - 1) * limit;
        
        const requestExames: RequestExames = {
            idPaciente: req.query.idPaciente as string | undefined,
            idProfissional: req.usuarioLogado!.id,
            tipoExame: req.query.tipoExame as string | undefined,
            protocolo: req.query.protocolo as string | undefined,
            nomePaciente: nomePaciente,
            limit: limit,
            offset: offsetCalculado
        };

        const dadosExames  = await buscaExames(requestExames);
        return res.status(200).json(dadosExames)
    } catch {
        return res.status(500).json({
            error: 'Erro ao buscar exames'
        });
    }
}

export async function controladorExamesAdmin(req: Request, res: Response) {
    try {

        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;
        const nomePaciente = req.query.nomePaciente as string | undefined;
        const nomeProfissional = req.query.nomeProfissional as string | undefined;

        const offsetCalculado = (page - 1) * limit;

        const requestExames: RequestExames = {
            idPaciente: req.query.idPaciente as string | undefined,
            idProfissional: req.query.idProfissional as string | undefined,
            tipoExame: req.query.tipoExame as string | undefined,
            protocolo: req.query.protocolo as string | undefined,
            nomePaciente: nomePaciente,
            nomeProfissional: nomeProfissional,
            limit: limit,
            offset: offsetCalculado
        };

        console.log(requestExames)
        const dadosExames  = await buscaExames(requestExames);
        return res.status(200).json(dadosExames)
    } catch(erro) {
        console.log(erro)
        return res.status(500).json({
            error: 'Erro ao buscar exames'
        });
    }
}