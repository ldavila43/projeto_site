import { useState } from 'react';
import { RequestPostTipoExame } from './TiposExameDTO';

export function useCadastroTipoExame(onSubmitAction: (dados: RequestPostTipoExame) => Promise<void>) {
    const [form, setForm] = useState<RequestPostTipoExame>({
        nome: '',
        status: 'ATIVO',
        caminhoImagem: '',
        caminhoIcone: '',
        caminhoLogo: '',
        idCategoriaExame: undefined
    });
    const [salvando, setSalvando] = useState(false);

    function handleFieldChange(campo: keyof RequestPostTipoExame, valor: any) {
        setForm(prev => ({ ...prev, [campo]: valor }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSalvando(true);
        try {
            await onSubmitAction(form);
            alert('Tipo de exame cadastrado com sucesso!');
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