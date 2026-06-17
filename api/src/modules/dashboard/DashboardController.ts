import { Request, Response } from 'express';
import { servicoDadosDashPaciente } from './services/DashPacienteService';
import { servicoDadosDashProfissional } from './services/DashProfissionalService';
import { servicoDadosDashAdmin, servicoSolicitacoesDashAdmin } from './services/DashAdminService';
import { servicoCardsResumoDashColaborador, servicoEstatisticasTipoExameColaborador } from './services/DashColabService';


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

export async function dadosSolicitacoesAdmin(req: Request, res: Response) {
    try {
        const ano = req.query.ano as string;

        const dadosDash = await servicoSolicitacoesDashAdmin(ano);
        
        return res.status(200).json(dadosDash)
    } catch(erro) {
        const mensagem = erro instanceof Error ? erro.message : erro
        return res.status(500).json({
            error: mensagem
        });
    }
}

export async function dadosCardResumoColaborador(req: Request, res: Response) {
    try{
        const dadosCards = await servicoCardsResumoDashColaborador();
        
        return res.status(200).json(dadosCards)
    } catch(erro) {
        const mensagem = erro instanceof Error ? erro.message : erro
        return res.status(500).json({
            error: mensagem
        });
    }
}

export async function dadosTipoExameColaborador(req: Request, res: Response) {
    try {
        const dataIni =
            typeof req.query.dataIni === 'string'
                ? new Date(req.query.dataIni)
                : undefined;

        const dataFim =
            typeof req.query.dataFim === 'string'
                ? new Date(req.query.dataFim)
                : undefined;

        const limite =
            typeof req.query.limit === 'string'
                ? Number(req.query.limit)
                : undefined

        const dadosTipoExame = await servicoEstatisticasTipoExameColaborador(dataIni, dataFim, limite);

        return res.status(200).json(dadosTipoExame)
    } catch(erro) {
        const mensagem = erro instanceof Error ? erro.message : erro
        return res.status(500).json({
            error: mensagem
        });
    }
}