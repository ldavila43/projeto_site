'use client'
import { useState } from 'react';
import Card from '@/src/shared/components/Card';
import AsyncAutocomplete from '@/src/shared/components/AsyncAutocomplete';
import { useCadastroSolicitacao } from '../useCadastroSolicitacao';
import { X, Save } from 'lucide-react';

import { criarSolicitacaoExame } from '@/src/modules/solicitacoes_exame/solicitacoesActions'
import { buscarDadosPacientes } from '@/src/modules/pacientes/pacientesActions';
import { buscarDadosProfissionais } from '@/src/modules/profissionais/profissionaisActions';
import { buscarDadosKitsAmostra } from '@/src/modules/kits_amostra/kitsAmostraActions';
import { buscarDadosTiposExame } from '@/src/modules/tipos_exame/tiposExameActions'

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

export default function TemplateNovaSolicitacao() {
    const {
        form,
        salvando,
        handleFieldChange,
        adicionarExame,
        removerExame,
        adicionarKit,
        removerKit,
        handleSubmit
    } = useCadastroSolicitacao(criarSolicitacaoExame);
    
    const [kitsUI, setKitsUI] = useState<{ id: number, label: string }[]>([]);
    const [examesUI, setExamesUI] = useState<{ id: number, label: string }[]>([]);

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
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card titulo="Nova Solicitação">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Campos Simples */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Protocolo</label>
                        <input
                            type="text"
                            required
                            value={form.protocolo}
                            onChange={(e) => handleFieldChange('protocolo', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Ex: BGK-2024-001"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <AsyncAutocomplete
                        label="Paciente *"
                        placeholder="Buscar paciente..."
                        value={form.idPaciente}
                        onChange={(id) => handleFieldChange('idPaciente', String(id))}
                        fetcher={async (search) => {
                            const res = await buscarDadosPacientes({ nome: search, limit: '5' });
                            console.log(res.pacientes.map(p => ({ id: p.idPaciente, label: p.nome, idPessoa: p.idPessoa})));
                            return res.pacientes.map(p => ({ id: p.idPaciente, label: p.nome || 'Sem nome' }));

                        }}
                    />

                    <AsyncAutocomplete
                        label="Profissional Solicitante"
                        placeholder="Buscar profissional..."
                        value={form.idProfissional || ''}
                        onChange={(id) => handleFieldChange('idProfissional', String(id))}
                        fetcher={async (search) => {
                            const res = await buscarDadosProfissionais({ nome: search, limit: '5' });
                            return res.profissionais.map(p => ({ id: p.idProfissional, label: p.nome || 'Sem nome' }));
                        }}
                    />
                </div>

                <hr className="my-6 border-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <AsyncAutocomplete
                            label="Kits de Coleta"
                            placeholder="Buscar e adicionar kit..."
                            value=""
                            onChange={(id, label) => handleSelecionarKit(Number(id), label)}
                            fetcher={async (search) => {
                                const res =  await buscarDadosKitsAmostra({codBgk: search, limit: 5});
                                console.log(res);
                                return res.kitsAmostra.map(kit => ({ id: kit.idKit, label: kit.codBgk || 'Sem nome' }));
                            }}
                        />
                        <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
                            {kitsUI.length === 0 && <span className="text-sm text-gray-400">Nenhum kit adicionado.</span>}
                            {kitsUI.map(kit => (
                                <TagItem key={kit.id} label={kit.label} onRemove={() => handleRemoverKit(kit.id)} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <AsyncAutocomplete
                            label="Exames Solicitados *"
                            placeholder="Buscar e adicionar exame..."
                            value=""
                            onChange={(id, label) => handleSelecionarExame(Number(id), label)}
                            fetcher={async (search) => {
                                const res = buscarDadosTiposExame({descricao: search, limit: 5})
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

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="submit"
                        disabled={salvando || !form.idPaciente || examesUI.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {salvando ? 'Salvando...' : <><Save className="w-4 h-4" /> Cadastrar Solicitação</>}
                    </button>
                </div>
            </Card>
        </form>
    );
}