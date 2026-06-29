import { useState } from 'react';
import { RequestPostSolicitacaoDTO, ExamesDTO } from './SolicitacaoDTO';

export function useCadastroSolicitacao(onSubmitAction: (dados: RequestPostSolicitacaoDTO) => Promise<string>) {
    const [form, setForm] = useState<RequestPostSolicitacaoDTO>({
        idPaciente: '',
        idProfissional: '',
        dataSolicitacao: new Date(),
        statusSolicitacao: 'PENDENTE',
        protocolo: '',
        idKits: [],
        exames: []
    });
    const [salvando, setSalvando] = useState(false);

    function handleFieldChange(campo: keyof RequestPostSolicitacaoDTO, valor: any) {
        setForm(prev => ({ ...prev, [campo]: valor }));
    }

    function adicionarExame(idTipoExame: number) {
        if (form.exames.find(e => e.idTipoExame === idTipoExame)) return;
        setForm(prev => ({
            ...prev,
            exames: [...prev.exames, { idTipoExame, descricao: '' }]
        }));
    }

    function removerExame(idTipoExame: number) {
        setForm(prev => ({
            ...prev,
            exames: prev.exames.filter(e => e.idTipoExame !== idTipoExame)
        }));
    }

    function adicionarKit(idKit: number) {
        if (form.idKits.includes(idKit)) return;
        setForm(prev => ({ ...prev, idKits: [...prev.idKits, idKit] }));
    }

    function removerKit(idKit: number) {
        setForm(prev => ({
            ...prev,
            idKits: prev.idKits.filter(id => id !== idKit)
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSalvando(true);
        try {
            await onSubmitAction(form);
            alert('Solicitação cadastrada com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar solicitação.');
        } finally {
            setSalvando(false);
        }
    }

    return {
        form,
        salvando,
        handleFieldChange,
        adicionarExame,
        removerExame,
        adicionarKit,
        removerKit,
        handleSubmit
    };
}