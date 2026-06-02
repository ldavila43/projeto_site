import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export interface GraficoBarrasProps {
    dados: any[];
    chaveX: string;
    chaveY: string;
    corBarra?: string;
}

export function GraficoBarrasGenerico({
    dados,
    chaveX,
    chaveY,
    corBarra = "#3b82f6"
}: GraficoBarrasProps) {
    return (
        <div className="w-full h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey={chaveX}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#f3f4f6' }} 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey={chaveY} fill={corBarra} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}