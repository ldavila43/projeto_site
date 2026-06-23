'use client'
import { GraficoBarrasEmpilhadas } from '@/components/ui/GraficoBarrasEmpilhadas'
import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { buscarDadosProfissionais } from '@/actions/dashBoardActions';
import { DashProfissionaisDTO } from '@/models/ViewProfissionaisDTO'
import { transformarExamesParaGrafico } from '@/utils/transformarExames'

export function ViewProfissional() {
    const [dados, setDados] = useState<DashProfissionaisDTO | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [idPaciente, setIdPaciente] = useState();
    const { dadosTransformados, tiposUnicos } = dados
        ? transformarExamesParaGrafico(dados.exames)
        : { dadosTransformados: [], tiposUnicos: [] };
    const [dataIni, setDataIni] = useState(
        new Date(new Date().getFullYear(), 0, 1)
            .toISOString()
            .split('T')[0]
    );
    const [dataFim, setDataFim] = useState(
        new Date()
            .toISOString()
            .split('T')[0]
    );

    useEffect(() => {
        async function carregarDados() {
            try {
                const resultado: DashProfissionaisDTO = await buscarDadosProfissionais(idPaciente, dataIni, dataFim);
                setDados(resultado);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setCarregando(false);
            }
        }
        carregarDados();
    }, [idPaciente, dataIni, dataFim]);

    if (carregando) {
        return <div>Carregando estatísticas...</div>;
    }

    return (
        <div >
            <span className='py-3 text-gray-600 text-base'>Acompanhe seus exames, incluindo os pendentes de aprobação no laboratório e os laudos já liberados para dowload</span>
            <div className='flex flex-col gap-3'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card titulo="Total de Pacientes">
                        <span className="text-4xl font-bold text-gray-900 mt-2">
                            {dados?.estatisticas.totalPacientes}
                        </span>
                    </Card>

                    <Card titulo="Exames Concluídos">
                        <span className="text-4xl font-bold text-gray-900 mt-2">
                            {dados?.estatisticas.analisesCompletas}
                        </span>
                    </Card>


                    <Card titulo="Exames Pendentes">
                        <span className="text-4xl font-bold text-green-600 mt-2">
                            {dados?.estatisticas.analisesPendentes}
                        </span>
                    </Card>
                </div>

                <Card titulo="Resumo de exames">
                    <div className="mb-4 flex felx-col gap-2">
                        <label htmlFor="data-ini" className="text-sm font-medium text-gray-700 mr-2">Data Inicio:</label>
                        <input
                            id="data-ini"
                            type="date"
                            defaultValue={dataIni}
                            onBlur={(e) => setDataIni(e.target.value)}
                            className="border border-gray-300 rounded-md p-1.5 text-sm"
                        >
                        </input>
                        <label htmlFor="data-fim" className="text-sm font-medium text-gray-700 mr-2">Data Fim:</label>
                        <input
                            id="data-fim"
                            type="date"
                            defaultValue={dataFim}
                            onBlur={(e) => setDataFim(e.target.value)}
                            className="border border-gray-300 rounded-md p-1.5 text-sm"
                        >
                        </input>
                    </div>
                    <GraficoBarrasEmpilhadas
                        dados={dadosTransformados}
                        chaveX="periodo"
                        chavesY={tiposUnicos}
                    />
                </Card>
            </div>
        </div>
    );
}