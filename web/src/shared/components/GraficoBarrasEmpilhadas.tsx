import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CORES = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface GraficoBarrasProps {
    dados: any[];
    chaveX: string;
    chavesY: string[];
}

export function GraficoBarrasEmpilhadas({ dados, chaveX, chavesY }: GraficoBarrasProps) {
    return (
        <div className="w-full h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey={chaveX} tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ fill: '#f3f4f6' }}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white p-3 rounded-lg shadow-md text-xs text-gray-700 min-w-[150px]">
                                        <p className="font-bold border-b pb-1 mb-1 text-gray-900">{label}</p>
                                        
                                        {payload
                                            .filter(item => (item.value as number) > 0)
                                            .map((item, index) => (
                                                <div key={index} className="flex justify-between gap-4 py-0.5">
                                                    <span style={{ color: item.color }} className="truncate max-w-[150px]">
                                                        {item.name}
                                                    </span>
                                                    <span className="font-semibold">
                                                        {Number(item.value)}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                );
                            }
                            return null;
                        }} 
                    />
                    <Legend
                        formatter={(valor) => (
                            <span
                                title={valor}
                                style={{ fontSize: 'clamp(10px, 1.2vw, 14px)' }}
                                className="text-gray-600 truncate inline-block max-w-[80px] sm:max-w-[120px] align-bottom"
                            >
                                {valor}
                            </span>
                        )}
                    />
                    {chavesY.map((chave, i) => (
                        <Bar
                            key={chave}
                            dataKey={chave}
                            stackId="a"
                            className={"text-xs"}
                            fill={CORES[i % CORES.length]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}