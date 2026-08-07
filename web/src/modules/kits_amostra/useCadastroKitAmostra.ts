import { useState } from 'react';
import { RequestPostKitAmostra } from './KitsAmostraDTO';

const FORM_INICIAL: RequestPostKitAmostra = {
    codBgk: '',
    idTipoKit: 0,
    local: '',
    codigoLote: '',
    codigoBarras: '',
    dataValidade: '',
    status: 'INATIVO',
    idResponsavel: '',
    dataAtivacao: ''
};

export function useCadastroKitAmostra(
    cadastrar: (dados: RequestPostKitAmostra) => Promise<string>
) {
    const [form, setForm] = useState<RequestPostKitAmostra>(FORM_INICIAL);
    const [salvando, setSalvando] = useState(false);

    function alterarCampo<K extends keyof RequestPostKitAmostra>(
        campo: K,
        valor: RequestPostKitAmostra[K]
    ) {
        setForm((anterior) => ({ ...anterior, [campo]: valor }));
    }

    async function enviar(onSucesso: () => void) {
        setSalvando(true);

        try {
            const mensagem = await cadastrar({
                ...form,
                local: form.local?.trim() || undefined,
                codigoBarras: form.codigoBarras?.trim() || undefined,
                idResponsavel: form.idResponsavel || undefined,
                dataAtivacao: form.dataAtivacao || undefined
            });
            alert(mensagem);
            onSucesso();
        } catch (erro) {
            const mensagem = erro instanceof Error
                ? erro.message
                : 'Erro ao cadastrar kit de amostra.';
            alert(mensagem);
        } finally {
            setSalvando(false);
        }
    }

    return {
        form,
        salvando,
        alterarCampo,
        enviar
    };
}
