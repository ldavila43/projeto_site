import { Request, Response } from 'express'
import { servicoDadosDashPaciente, servicoDadosDashProfissional,servicoDadosDashAdmin} from '../services/DashboardService'


export async function dadosDashPacientes(req: Request, res: Response) {
    try {

        const idPaciente = req.usuarioLogado!.id;
        const dadosDash = await servicoDadosDashPaciente(idPaciente);

        return res.status(200).json(dadosDash);
    } catch {
        return res.status(500).json({
            error: 'Erro ao buscar dashboard'
        });
    }
}

export async function dadosDashProfissionais(req: Request, res: Response) {
    try {
        const idProfissional = req.usuarioLogado!.id;

        const idPaciente =
        typeof req.query.idPaciente === 'string'
            ? req.query.idPaciente
            : undefined;

        const dataIni =
            typeof req.query.dataIni === 'string'
                ? new Date(req.query.dataIni)
                : undefined;

        const dataFim =
            typeof req.query.dataFim === 'string'
                ? new Date(req.query.dataFim)
                : undefined;

        const dadosDash = await servicoDadosDashProfissional(idProfissional, idPaciente, dataIni, dataFim);
        return res.status(200).json(dadosDash)
    } catch {
        return res.status(500).json({
            error: 'Erro ao buscar dashboard'
        });
    }
}


export async function dadosDashAdmin(req: Request, res: Response) {
    try {
        const ano = req.query.ano as string | undefined;

        const dadosDash = await servicoDadosDashAdmin(ano);
        
        return res.status(200).json(dadosDash)
    } catch(erro) {
        const mensagem = erro instanceof Error ? erro.message : erro
        return res.status(500).json({
            error: mensagem
        });
    }
}