import { useState } from 'react';
import { RequestPostTipoExame } from './TiposExameDTO';

export function useCadastroTipoExame(onSubmitAction: (dados: RequestPostTipoExame) => Promise<void>, onSucesso: () => void) {
    const [form, setForm] = useState<RequestPostTipoExame>({
        nome: '',
        status: 'ATIVO',
        caminhoImagem: '',
        caminhoIcone: '',
        caminhoLogo: '',
        idCategoriaExame: undefined
    });
    const [salvando, setSalvando] = useState(false);

    function handleFieldChange<K extends keyof RequestPostTipoExame>(
        campo: K,
        valor: RequestPostTipoExame[K]
    ) {
        setForm(prev => ({ ...prev, [campo]: valor }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSalvando(true);
        try {
            await onSubmitAction(form);
            alert('Tipo de exame cadastrado com sucesso!');
            onSucesso();
        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar tipo de exame.');
        } finally {
            setSalvando(false);
        }
    }

    return {
        form,
        salvando,
        handleFieldChange,
        handleSubmit
    };
}
