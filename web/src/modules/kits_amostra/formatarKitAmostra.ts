import type { KitAmostra } from './KitsAmostraDTO';
import { formatarValorEnum } from '@/src/shared/utils/StatusEnum';

type DadosTipoAmostraKit = Pick<
    KitAmostra,
    'idTipoAmostra' | 'nomeTipoAmostra'
>;

type DadosResumoKit = Pick<
    KitAmostra,
    | 'codBgk'
    | 'tipoKit'
    | 'status'
    | 'idTipoAmostra'
    | 'nomeTipoAmostra'
>;

export function formatarTipoAmostraKit(
    kit: DadosTipoAmostraKit
): string | null {
    if (kit.nomeTipoAmostra && kit.idTipoAmostra !== undefined) {
        return `${kit.nomeTipoAmostra} (#${kit.idTipoAmostra})`;
    }
    if (kit.nomeTipoAmostra) return kit.nomeTipoAmostra;
    if (kit.idTipoAmostra !== undefined) return `#${kit.idTipoAmostra}`;
    return null;
}

export function formatarResumoKitAmostra(kit: DadosResumoKit): string {
    const tipoAmostra = formatarTipoAmostraKit(kit);

    return [
        kit.codBgk,
        kit.tipoKit ? `Kit: ${kit.tipoKit}` : null,
        tipoAmostra ? `Amostra: ${tipoAmostra}` : null,
        formatarValorEnum(kit.status)
    ].filter(Boolean).join(' — ');
}
