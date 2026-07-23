import { useState } from 'react';
import { RequestPostKitAmostra } from './KitsAmostraDTO';

const FORM_INICIAL: RequestPostKitAmostra = {
    codBgk: '',
    idTipoKit: 0,
    local: '',
    codigoLote: '',
    codApoio: '',
    dataValidade: '',
    status: 'INATIVO',
    idResponsavel: '',
    dataAtivacao: ''
};

export function useCadastroKitAmostra(
    cadastrar: (dados: RequestPostKitAmostra) => Promise<void>
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
            await cadastrar({
                ...form,
                local: form.local?.trim() || undefined,
                codApoio: form.codApoio?.trim() || undefined,
                idResponsavel: form.idResponsavel || undefined,
                dataAtivacao: form.dataAtivacao || undefined
            });
            alert('Kit de amostra cadastrado com sucesso!');
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
