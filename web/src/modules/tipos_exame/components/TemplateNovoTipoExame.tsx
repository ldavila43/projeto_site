'use client'
import Card from '@/src/shared/components/Card';
import AsyncAutocomplete from '@/src/shared/components/AsyncAutocomplete';
import { useCadastroTipoExame } from '../useCadastroTipoExame';
import { Save } from 'lucide-react';
import { criarTipoExame } from '@/src/modules/tipos_exame/tiposExameActions';
import { buscarDadosCategoriasExames } from '@/src/modules/categorias_exame/categoriasExameAction';

export default function TemplateNovoTipoExame() {
    const { form, salvando, handleFieldChange, handleSubmit } = useCadastroTipoExame(criarTipoExame);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Card titulo="Novo Tipo de Exame">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Exame *</label>
                        <input
                            type="text"
                            required
                            value={form.nome}
                            onChange={(e) => handleFieldChange('nome', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Ex: Hemograma Completo"
                        />
                    </div>
                    <AsyncAutocomplete
                        label="Categoria do Exame"
                        placeholder="Buscar categoria..."
                        value={form.idCategoriaExame || ''}
                        onChange={(id, label) => handleFieldChange('idCategoriaExame', Number(id))}
                        fetcher={async (search) => {
                            const res = await buscarDadosCategoriasExames({ nome: search, limit: '5' });
                            return res.categorias.map(cat => ({ id: cat.idCategoria, label: cat.descricao }));
                        }}
                    />

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => handleFieldChange('status', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="ATIVO">Ativo</option>
                            <option value="INATIVO">Inativo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caminho do Ícone</label>
                        <input
                            type="text"
                            value={form.caminhoIcone}
                            onChange={(e) => handleFieldChange('caminhoIcone', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            placeholder="/assets/icones/exame.png"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caminho da Logo</label>
                        <input
                            type="text"
                            value={form.caminhoLogo}
                            onChange={(e) => handleFieldChange('caminhoLogo', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            placeholder="/assets/logos/lab.png"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="submit"
                        disabled={salvando || !form.nome}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {salvando ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Tipo de Exame</>}
                    </button>
                </div>
            </Card>
        </form>
    );
}