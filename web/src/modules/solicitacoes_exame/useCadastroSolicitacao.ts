import { useState } from 'react';
import {
    DecisaoAmostraGenetica,
    DetalhesConflitoAmostraGenetica,
    RequestPostSolicitacaoDTO,
    ResultadoCadastroSolicitacao
} from './SolicitacaoDTO';

export function useCadastroSolicitacao(
    onSubmitAction: (
        dados: RequestPostSolicitacaoDTO
    ) => Promise<ResultadoCadastroSolicitacao>
) {
    const [form, setForm] = useState<RequestPostSolicitacaoDTO>({
        idPaciente: '',
        idProfissional: '',
        dataSolicitacao: new Date().toISOString(),
        protocolo: '',
        quantidadeKits: 0,
        idKits: [],
        idsTiposExames: []
    });
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [conflitoAmostraGenetica, setConflitoAmostraGenetica] = useState<
        DetalhesConflitoAmostraGenetica | null
    >(null);

    function handleFieldChange<K extends keyof RequestPostSolicitacaoDTO>(
        campo: K,
        valor: RequestPostSolicitacaoDTO[K]
    ) {
        setForm(prev => ({ ...prev, [campo]: valor }));
    }

    function adicionarExame(idTipoExame: number) {
        if (form.idsTiposExames.includes(idTipoExame)) return;
        setForm(prev => ({
            ...prev,
            idsTiposExames: [...prev.idsTiposExames, idTipoExame]
        }));
    }

    function removerExame(idTipoExame: number) {
        setForm(prev => ({
            ...prev,
            idsTiposExames: prev.idsTiposExames.filter(
                id => id !== idTipoExame
            )
        }));
    }

    function adicionarKit(idKit: number) {
        if (form.idKits?.includes(idKit)) return;
        setForm(prev => ({
            ...prev,
            idKits: [...(prev.idKits ?? []), idKit]
        }));
    }

    function removerKit(idKit: number) {
        setForm(prev => ({
            ...prev,
            idKits: prev.idKits?.filter(id => id !== idKit) ?? []
        }));
    }

    async function executarCadastro(
        dados: RequestPostSolicitacaoDTO,
        onSucesso: () => void
    ) {
        setErro(null);
        setSalvando(true);
        try {
            const resultado = await onSubmitAction(dados);
            if (resultado.sucesso) {
                setConflitoAmostraGenetica(null);
                alert(resultado.mensagem);
                onSucesso();
                return;
            }

            if (resultado.tipo === 'CONFLITO_AMOSTRA_GENETICA') {
                setConflitoAmostraGenetica(resultado.conflito);
                return;
            }

            setConflitoAmostraGenetica(null);
            setErro(resultado.mensagem);
        } catch (error) {
            setConflitoAmostraGenetica(null);
            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao salvar solicitação.'
            );
        } finally {
            setSalvando(false);
        }
    }

    async function handleSubmit(e: React.FormEvent, onSucesso: () => void) {
        e.preventDefault();
        await executarCadastro(form, onSucesso);
    }

    async function resolverConflitoAmostraGenetica(
        decisao: DecisaoAmostraGenetica,
        onSucesso: () => void
    ) {
        await executarCadastro({
            ...form,
            decisaoAmostraGenetica: decisao
        }, onSucesso);
    }

    function cancelarConflitoAmostraGenetica() {
        setConflitoAmostraGenetica(null);
    }

    return {
        form,
        salvando,
        erro,
        conflitoAmostraGenetica,
        handleFieldChange,
        adicionarExame,
        removerExame,
        adicionarKit,
        removerKit,
        handleSubmit,
        resolverConflitoAmostraGenetica,
        cancelarConflitoAmostraGenetica
    };
}
