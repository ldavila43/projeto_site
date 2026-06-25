import { ReactNode } from 'react';

export interface CardProps {
    titulo: string;
    icone?: ReactNode;
    children: ReactNode;
}

export default function Card({ titulo, icone, children }: CardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                {icone && (
                    <div className="text-blue-600 flex-shrink-0">
                        {icone}
                    </div>
                )}
                <h2 className="text-lg font-semibold text-gray-800">
                    {titulo}
                </h2>
            </div>
            <div className="flex-1 flex flex-col">
                {children}
            </div>
            
        </div>
    );
}