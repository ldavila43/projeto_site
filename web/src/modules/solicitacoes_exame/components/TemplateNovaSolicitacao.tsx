'use client'
import { useCallback, useContext, useState } from 'react';
import Card from '@/src/shared/components/Card';
import AsyncAutocomplete from '@/src/shared/components/AsyncAutocomplete';
import SeletorBuscaPessoa, {
    CriterioBuscaPessoa
} from '@/src/modules/pessoas/components/SeletorBuscaPessoa';
import { useCadastroSolicitacao } from '../useCadastroSolicitacao';
import { X, Save } from 'lucide-react';
import { criarSolicitacaoExame } from '@/src/modules/solicitacoes_exame/solicitacoesActions'
import { buscarDadosPacientes } from '@/src/modules/pacientes/pacientesActions';
import { buscarDadosProfissionais } from '@/src/modules/profissionais/profissionaisActions';
import { buscarDadosKitsAmostra } from '@/src/modules/kits_amostra/kitsAmostraActions';
import { formatarResumoKitAmostra } from '@/src/modules/kits_amostra/formatarKitAmostra';
import { buscarDadosTiposExame } from '@/src/modules/tipos_exame/tiposExameActions'
import {
    formatarValorEnum,
    STATUS_SOLICITACOES
} from '@/src/shared/utils/StatusEnum';
import type { StatusSolicitacao } from '@/src/shared/utils/StatusEnum';
import ModalConflitoAmostraGenetica from './ModalConflitoAmostraGenetica';
import { AuthContext } from '@/src/shared/AuthContext';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

interface PropsTemplateTipoExame {
    onSucesso: () => void
}

const classeCampo = 'w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

function dataHoraParaInput(data?: string): string {
    if (!data) return '';
    const valor = new Date(data);
    if (Number.isNaN(valor.getTime())) return '';

    const completar = (numero: number) => String(numero).padStart(2, '0');
    return [
        valor.getFullYear(),
        completar(valor.getMonth() + 1),
        completar(valor.getDate())
    ].join('-') + `T${completar(valor.getHours())}:${completar(valor.getMinutes())}`;
}

function TagItem({ label, onRemove }: { label: string, onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {label}
            <button type="button" onClick={onRemove} className="text-blue-600 hover:text-blue-900">
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}

export default function TemplateNovaSolicitacao({onSucesso}: PropsTemplateTipoExame) {
    const contexto = useContext(AuthContext);
    const {
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
    } = useCadastroSolicitacao(criarSolicitacaoExame);
    
    const [kitsUI, setKitsUI] = useState<{ id: number, label: string }[]>([]);
    const [examesUI, setExamesUI] = useState<{ id: number, label: string }[]>([]);
    const podeDefinirStatus = contexto?.perfilAtivo === PERFIS.ADMINISTRADOR;

    const buscarPacientes = useCallback(async (
        termo: string,
        criterio: CriterioBuscaPessoa
    ) => {
        const resposta = await buscarDadosPacientes({
            ...(criterio === 'nome'
                ? { nome: termo }
                : { documentoPaciente: termo }),
            limit: '5'
        });
        return resposta.pacientes.map((paciente) => ({
            id: paciente.idPaciente,
            label: paciente.nome || 'Sem nome'
        }));
    }, []);

    const buscarProfissionais = useCallback(async (
        termo: string,
        criterio: CriterioBuscaPessoa
    ) => {
        const resposta = await buscarDadosProfissionais({
            ...(criterio === 'nome'
                ? { nome: termo }
                : { documentoProfissional: termo }),
            limit: '5'
        });
        return resposta.profissionais.map((profissional) => ({
            id: profissional.idProfissional,
            label: profissional.nome || 'Sem nome'
        }));
    }, []);

    function handleSelecionarKit(id: number, label: string) {
        if (kitsUI.find(k => k.id === id)) return;
        setKitsUI([...kitsUI, { id, label }]);
        adicionarKit(id);
    }

    function handleRemoverKit(id: number) {
        setKitsUI(kitsUI.filter(k => k.id !== id));
        removerKit(id);
    }

    function handleSelecionarExame(id: number, label: string) {
        if (examesUI.find(e => e.id === id)) return;
        setExamesUI([...examesUI, { id, label }]);
        adicionarExame(id);
    }

    function handleRemoverExame(id: number) {
        setExamesUI(examesUI.filter(e => e.id !== id));
        removerExame(id);
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, onSucesso)} className="space-y-6">
            <Card titulo="Nova Solicitação">
                <p className="mb-5 text-sm text-gray-600">
                    Campos marcados com <strong>*</strong> são obrigatórios.
                </p>

                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Protocolo da solicitação
                        </label>
                        <input
                            type="text"
                            value={form.protocolo ?? ''}
                            onChange={(e) => handleFieldChange('protocolo', e.target.value)}
                            className={classeCampo}
                            placeholder="Protocolo opcional"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Data da solicitação
                        </label>
                        <input
                            type="datetime-local"
                            value={dataHoraParaInput(form.dataSolicitacao)}
                            onChange={(evento) => handleFieldChange(
                                'dataSolicitacao',
                                evento.target.value
                                    ? new Date(evento.target.value).toISOString()
                                    : undefined
                            )}
                            className={classeCampo}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Status inicial
                        </label>
                        {podeDefinirStatus ? (
                            <select
                                value={form.statusSolicitacao ?? ''}
                                onChange={(evento) => handleFieldChange(
                                    'statusSolicitacao',
                                    evento.target.value
                                        ? evento.target.value as StatusSolicitacao
                                        : undefined
                                )}
                                className={classeCampo}
                            >
                                <option value="">
                                    Aguardando Pagamento (padrão)
                                </option>
                                {STATUS_SOLICITACOES
                                    .filter((status) => status !== 'AGUARDANDO PAGAMENTO')
                                    .map((status) => (
                                        <option key={status} value={status}>
                                            {formatarValorEnum(status)}
                                        </option>
                                    ))}
                            </select>
                        ) : (
                            <input
                                value="Aguardando Pagamento"
                                readOnly
                                className={`${classeCampo} cursor-not-allowed bg-gray-100 text-gray-600`}
                            />
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {podeDefinirStatus
                                ? 'Deixe o padrão para cadastrar como aguardando pagamento.'
                                : 'O status inicial é definido automaticamente como aguardando pagamento.'}
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <SeletorBuscaPessoa
                        label="Paciente *"
                        placeholderNome="Digite o nome do paciente..."
                        placeholderCpf="Digite o CPF do paciente..."
                        value={form.idPaciente}
                        onChange={(id) => handleFieldChange('idPaciente', String(id))}
                        fetcher={buscarPacientes}
                        required
                    />

                    <SeletorBuscaPessoa
                        label="Profissional Solicitante"
                        placeholderNome="Digite o nome do profissional..."
                        placeholderCpf="Digite o CPF do profissional..."
                        value={form.idProfissional || ''}
                        onChange={(id) => handleFieldChange('idProfissional', String(id))}
                        fetcher={buscarProfissionais}
                    />
                </div>

                <hr className="my-6 border-gray-200" />

                <fieldset className="mb-6 rounded-lg border border-gray-200 p-4">
                    <legend className="px-2 text-sm font-semibold text-gray-800">
                        Kits de coleta *
                    </legend>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Quantidade de kits prevista *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="1"
                                value={form.quantidadeKits}
                                onChange={(evento) => handleFieldChange(
                                    'quantidadeKits',
                                    Number(evento.target.value)
                                )}
                                className={classeCampo}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Informe zero quando nenhum novo kit for necessário.
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                O backend validará a quantidade mínima conforme os
                                tipos de amostra dos exames selecionados.
                            </p>
                        </div>
                        <div>
                            <AsyncAutocomplete
                                label="Kits já conhecidos"
                                placeholder="Buscar pelo código BGK..."
                                value=""
                                onChange={(id, label) => handleSelecionarKit(Number(id), label)}
                                fetcher={async (search) => {
                                    const res = await buscarDadosKitsAmostra({ codBgk: search, limit: '5' });
                                    return res.kitsAmostra.map(kit => ({
                                        id: kit.idKit,
                                        label: formatarResumoKitAmostra(kit)
                                    }));
                                }}
                            />
                            <div className="mt-3 flex min-h-[32px] flex-wrap gap-2">
                                {kitsUI.length === 0 && (
                                    <span className="text-sm text-gray-400">
                                        Nenhum kit selecionado.
                                    </span>
                                )}
                                {kitsUI.map(kit => (
                                    <TagItem key={kit.id} label={kit.label} onRemove={() => handleRemoverKit(kit.id)} />
                                ))}
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Kits informados: {kitsUI.length}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                A seleção é opcional e pode representar apenas parte da
                                quantidade prevista. Ao serem vinculados, os kits terão o
                                paciente da solicitação definido como responsável.
                            </p>
                        </div>
                    </div>
                </fieldset>

                <div className="grid grid-cols-1 gap-6">

                    <div>
                        <AsyncAutocomplete
                            label="Exames Solicitados *"
                            placeholder="Buscar e adicionar exame..."
                            value=""
                            onChange={(id, label) => handleSelecionarExame(Number(id), label)}
                            fetcher={async (search) => {
                                const res = buscarDadosTiposExame({descricao: search, limit: '5'})
                                return (await res).tiposExame.map(tipoExame => ({ id: tipoExame.idTipoExame, label: tipoExame.descricao || 'Sem nome' }));
                            }}
                        />
                        <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
                            {examesUI.length === 0 && <span className="text-sm text-gray-400">Nenhum exame adicionado.</span>}
                            {examesUI.map(exame => (
                                <TagItem key={exame.id} label={exame.label} onRemove={() => handleRemoverExame(exame.id)} />
                            ))}
                        </div>
                    </div>
                </div>

                {erro && (
                    <p
                        role="alert"
                        className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {erro}
                    </p>
                )}

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="submit"
                        disabled={
                            salvando
                            || !form.idPaciente
                            || examesUI.length === 0
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {salvando ? 'Salvando...' : <><Save className="w-4 h-4" /> Cadastrar Solicitação</>}
                    </button>
                </div>
            </Card>

            {conflitoAmostraGenetica && (
                <ModalConflitoAmostraGenetica
                    detalhes={conflitoAmostraGenetica}
                    salvando={salvando}
                    onCancelar={cancelarConflitoAmostraGenetica}
                    onSolicitarNovaColeta={() => void resolverConflitoAmostraGenetica(
                        { acao: 'SOLICITAR_NOVA_COLETA' },
                        onSucesso
                    )}
                    onVincularAmostra={(idAmostra) => void resolverConflitoAmostraGenetica(
                        { acao: 'VINCULAR_EXISTENTE', idAmostra },
                        onSucesso
                    )}
                />
            )}
        </form>
    );
}
