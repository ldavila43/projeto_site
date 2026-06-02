'use client'

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { buscarDadosPacientes } from '@/actions/dashBoardActions';
import { DashPacientesDTO } from '@/DTO/ViewPacienteDTO'

export function ViewPaciente() {
    const [dados, setDados] = useState<DashPacientesDTO | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            try {
                const resultado: DashPacientesDTO = await buscarDadosPacientes();
                setDados(resultado);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setCarregando(false);
            }
        }
        
        carregarDados();
    }, []);

    if (carregando) {
        return <div>Carregando estatísticas...</div>;
    }

    return (
        <div>
            <span className='py-3 text-gray-600 text-base'>Acompanhe seus exames, incluindo os pendentes de aprobação no laboratório e os laudos já liberados para dowload</span>
            <div className="flex grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card titulo="Total de Exames Solicitados">
                    <span className="text-4xl font-bold text-gray-900 mt-2">
                        {dados?.estatisticas.total}
                    </span>
                </Card>

                <Card titulo="Exames Concluídos">
                    <span className="text-4xl font-bold text-green-600 mt-2">
                        {dados?.estatisticas.concluidos}
                    </span>
                </Card>
            </div>

            <Card titulo="Exames Recentes">
                {dados?.exames.length === 0 ? (
                    <p className="text-gray-500 italic mt-4">Nenhum exame encontrado.</p>
                ) : (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 text-sm text-gray-500">
                                    <th className="pb-3 font-semibold">Protocolo</th>
                                    <th className="pb-3 font-semibold">Tipo do Exame</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dados?.exames.map((exame, index) => (
                                    <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="py-3 text-gray-800 font-medium">{exame.protocolo}</td>
                                        <td className="py-3 text-gray-600">{exame.tipoExame}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                exame.status === 'CONCLUÍDO'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {exame.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
            
        </div>
    );
}