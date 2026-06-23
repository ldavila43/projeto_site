import { RequestExames } from '../DTO/RequestExamesDTO'
import { 
    buscaRazaoBacilotaBacteroidota, 
    buscaComposicaoPorDominio, 
    buscaIndiceShannon, 
    buscaTaxonsBeneficosPatogenos,
    buscaEnterotipoDominante 
} from '../repositories/microbioma/TaxonomiaRepository'
import { buscaTopVias, buscaSomaViasBioquimicas } from '../repositories/microbioma/ViasRepository'; 
import { buscaCalculoSeveridadePersistencia } from '../repositories/microbioma/VirulenciaResistenciaRepostiory'

export async function resolverPainelGeralShotgun(req: RequestExames) {
    const [indiceShannon, taxonsBeneficosPatogenos, enterotipoDominante, somaViasBioquimicas] = await Promise.all([
        buscaIndiceShannon(req.idExame, req.idPaciente, req.idProfissional),
        buscaTaxonsBeneficosPatogenos(req.idExame, req.idPaciente, req.idProfissional),
        buscaEnterotipoDominante(req.idExame, req.idPaciente, req.idProfissional),
        buscaSomaViasBioquimicas(req.idExame, req.idPaciente, req.idProfissional)
    ])
}

export async function resolverVisaoGeralShotgun(req: RequestExames) {
    const [bacilotaBacteroidota, composicaoDominio, topVias, severidadePersistencia] = await Promise.all([
        buscaRazaoBacilotaBacteroidota(req.idExame, req.idPaciente, req.idProfissional),
        buscaComposicaoPorDominio(req.idExame, req.idPaciente, req.idProfissional),
        buscaTopVias(req.idExame, req.idPaciente, req.idProfissional),
        buscaCalculoSeveridadePersistencia(req.idExame, req.idPaciente, req.idProfissional)
    ])

    return {
        composicaoDominio,
        bacilotaBacteroidota,
        topVias,
        severidadePersistencia
    }
}