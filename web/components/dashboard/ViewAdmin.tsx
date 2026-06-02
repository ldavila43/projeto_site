'use client'
import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { buscarDadosAdmin } from '@/actions/dashBoardActions';
import { DashAdminDTO } from '@/DTO/ViewAdminDTO'
import { GraficoBarrasGenerico } from '@/components/ui/Grafico'


export function ViewAdmin() {
    const [dados, setDados] = useState<DashAdminDTO | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [ano, setAno] = useState<string>(new Date().getFullYear().toString());

    useEffect(() => {
        async function carregarDados(){
            try {
                const resultados: DashAdminDTO = await buscarDadosAdmin(ano);
                setDados(resultados);
            } catch (error) {
            } finally  {
                setCarregando(false);
            }
        }
        carregarDados();
    }, [ano]);

    if(carregando && !dados) {
        return (
            <div className="p-6 text-gray-500 font-medium">Carregando estatísticas...</div>
        );
    }

    return (
        <div>
            <span className='py-3 text-gray-600 text-base'>
                Esta é a área operacional para a gestão de usuários, atribuição de perfmissões e visualização global dos exames.
            </span>
            <div className="flex grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card titulo="Usuários Ativos">
                    <span className="text-4xl font-bold text-gray-900 mt-2">
                        {dados?.estatisticas.usuarios}
                    </span>
                </Card>

                <Card titulo="Colaboradores Ativos">
                    <span className="text-4xl font-bold text-green-600 mt-2">
                        {dados?.estatisticas.colaboradores}
                    </span>
                </Card>
            </div>

            <Card titulo="Solicitações por Período">
                <div className="mb-4">
                    <label htmlFor="filtro-ano" className="text-sm font-medium text-gray-700 mr-2">Ano:</label>
                    <select
                        id="filtro-ano"
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                        className="border border-gray-300 rounded-md p-1.5 text-sm"
                    >
                        {dados?.anosDisponiveis.map((anoDisponivel) => (
                            <option key={anoDisponivel} value={anoDisponivel}>
                                {anoDisponivel}
                            </option>
                        ))}
                    </select>
                </div>
                <GraficoBarrasGenerico
                    dados={dados?.solicitacoesPeriodo ?? []}
                    chaveX="periodo"
                    chaveY="solicitacoes"
                />
            </Card>
            
        </div>
    );
}
export default ViewAdmin