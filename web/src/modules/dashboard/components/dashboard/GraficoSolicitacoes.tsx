'use client'
import { useState, useEffect, useRef } from 'react';
import Card from '@/src/shared/components/Card';
import { buscarSolicitacoesAdmin } from '@/src/modules/dashboard/dashBoardActions';
import { SolicitacoesPeriodo } from '@/src/modules/dashboard/ViewAdminDTO';
import { GraficoBarrasGenerico } from '@/src/shared/components/Grafico';

interface GraficoSolicitacoesProps {
    solicitacoesIni: SolicitacoesPeriodo[];
    anosDisponiveis: string[];
    anoDefault: string;
}

export function GraficoSolicitacoes({ solicitacoesIni, anosDisponiveis, anoDefault }: GraficoSolicitacoesProps) {
    const [solicitacoes, setSolicitacoes] = useState(solicitacoesIni);
    const [ano, setAno] = useState(anoDefault);
    const [carregando, setCarregando] = useState(false);

    const primeiroRender = useRef(true);

    useEffect(() => {
        if (primeiroRender.current) {
            primeiroRender.current = false;
            return;
        }

        async function atualizarGrafico() {
        setCarregando(true);
            try {
                const resultado = await buscarSolicitacoesAdmin(ano);
                setSolicitacoes(resultado.solicitacoesPeriodo!);
            } catch (error) {
                
            } finally {
                setCarregando(false);
            }
        }

        atualizarGrafico();
    }, [ano]);

    return (
        <Card titulo="Solicitações por Período">
        <div className="mb-4">
            <label htmlFor="filtro-ano" className="text-sm font-medium text-gray-700 mr-2">
            Ano:
            </label>
            <select
            id="filtro-ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="border border-gray-300 rounded-md p-1.5 text-sm"
            >
            {anosDisponiveis.map((anoDisponivel) => (
                <option key={anoDisponivel} value={anoDisponivel}>
                {anoDisponivel}
                </option>
            ))}
            </select>
        </div>
        <div className={carregando ? 'opacity-40 pointer-events-none' : ''}>
        <GraficoBarrasGenerico
            dados={solicitacoes}
            chaveX="periodo"
            chaveY="solicitacoes"
        />
        </div>
        </Card>
    );
}