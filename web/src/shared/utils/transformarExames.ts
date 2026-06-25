
import { ExamesPeriodo } from '@/src/modules/dashboard/ViewProfissionaisDTO';

export function transformarExamesParaGrafico(dados: ExamesPeriodo[]){
    const tiposUnicos = [...new Set(
        dados.flatMap(r => r.exames.map(e => e.tipoExame))
    )];

    const dadosTransformados = dados.map(row => {
        const ponto: Record<string, string | number> = { periodo: row.periodo };
        tiposUnicos.forEach(tipo => { ponto[tipo] = 0; });
        row.exames.forEach(e => { ponto[e.tipoExame] = e.contagem; });
        return ponto;
    });

    return { dadosTransformados, tiposUnicos };
}