'use client'

import { useState } from 'react';
import Card from '@/src/shared/components/Card';
import {
    CardsResumoLaboratorio,
    GraficoExamesLaboratorio
} from '../../ViewColaboradorDTO';
import { buscarGraficoLaboratorio } from '../../dashBoardActions';

interface ViewColaboradorProps {
    cards: CardsResumoLaboratorio;
    graficoInicial: GraficoExamesLaboratorio;
    dataIniInicial: string;
    dataFimInicial: string;
}

export default function ViewColaborador({
    cards,
    graficoInicial,
    dataIniInicial,
    dataFimInicial
}: ViewColaboradorProps) {
    const [grafico, setGrafico] = useState(graficoInicial);
    const [dataIni, setDataIni] = useState(dataIniInicial);
    const [dataFim, setDataFim] = useState(dataFimInicial);
    const [carregando, setCarregando] = useState(false);

    async function atualizarGrafico() {
        setCarregando(true);
        try {
            setGrafico(await buscarGraficoLaboratorio({ dataIni, dataFim, limite: 10 }));
        } finally {
            setCarregando(false);
        }
    }

    const itens = [
        ['Pacientes', cards.cardPacientes],
        ['Profissionais', cards.cardProfissionais],
        ['Solicitações', cards.cardSolicitacoes],
        ['Exames', cards.cardExames]
    ] as const;
    const tiposExame = grafico.TiposExame.map((tipo) => ({
        ...tipo,
        contagem: Number.isFinite(tipo.contagem) && tipo.contagem >= 0
            ? tipo.contagem
            : 0
    }));
    const maiorContagem = Math.max(
        1,
        ...tiposExame.map((tipo) => tipo.contagem)
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {itens.map(([titulo, dados]) => (
                    <Card key={titulo} titulo={titulo}>
                        <p className="text-3xl font-bold text-gray-900">{dados.mesAtual}</p>
                        <p className="mt-1 text-xs text-gray-500">Mês anterior: {dados.mesAnterior}</p>
                    </Card>
                ))}
            </div>

            <Card titulo="Exames por Tipo">
                <div className="mb-6 flex flex-wrap items-end gap-3">
                    <label className="text-sm text-gray-700">
                        <span className="mb-1 block">Data inicial</span>
                        <input type="date" value={dataIni} onChange={(e) => setDataIni(e.target.value)} className="rounded-md border p-2" />
                    </label>
                    <label className="text-sm text-gray-700">
                        <span className="mb-1 block">Data final</span>
                        <input type="date" value={dataFim} min={dataIni} onChange={(e) => setDataFim(e.target.value)} className="rounded-md border p-2" />
                    </label>
                    <button onClick={atualizarGrafico} disabled={carregando} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50">
                        {carregando ? 'Atualizando...' : 'Atualizar'}
                    </button>
                </div>

                <div className="space-y-3">
                    {tiposExame.map((tipo) => (
                        <div key={tipo.idTipoExame}>
                            <div className="mb-1 flex justify-between text-sm">
                                <span>{tipo.nomeTipoExame}</span>
                                <strong>{tipo.contagem}</strong>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-teal-500"
                                    style={{ width: `${(tipo.contagem / maiorContagem) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {tiposExame.length === 0 && (
                        <p className="text-sm text-gray-500">Nenhum exame encontrado no período.</p>
                    )}
                </div>
            </Card>
        </div>
    );
}
