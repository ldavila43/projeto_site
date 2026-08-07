'use client'
import Link from 'next/link';
import { useState } from 'react';
import { Rota } from '@/src/modules/operadores/operadoresDTO';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function MenuItem({ rota, abaAtual }: { rota: Rota; abaAtual: string }) {
    const hasSubMenus = rota.subMenus && rota.subMenus.length > 0;
    
    const isExatamenteAtivo = abaAtual === rota.href;
    const isSubRotaAtiva = hasSubMenus && rota.subMenus!.some(sub => abaAtual === sub.href);
    const isActiveContext = isExatamenteAtivo || isSubRotaAtiva;

    const [isOpen, setIsOpen] = useState(false);
    const menuAberto = isOpen || isActiveContext;

    const baseClasses = "flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors";
    const inactiveClasses = "text-gray-300 hover:bg-blue-900/50 hover:text-white";
    const activeClasses = "text-white bg-blue-900/50";

    if (!hasSubMenus) {
        return (
            <Link
                href={rota.href}
                className={`${baseClasses} ${isExatamenteAtivo ? activeClasses : inactiveClasses}`}
            >
                {rota.label}
            </Link>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${baseClasses} ${isActiveContext ? activeClasses : inactiveClasses}`}
            >
                <span>{rota.label}</span>
                {menuAberto ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {menuAberto && (
                <div className="flex flex-col gap-1 pl-4 mt-1 border-l border-gray-700/50 ml-4">
                    
                    <Link
                        href={rota.href}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            isExatamenteAtivo
                                ? 'text-white bg-blue-900/30 font-semibold'
                                : 'text-gray-400 hover:bg-blue-900/30 hover:text-white'
                        }`}
                    >
                        {rota.label}
                    </Link>

                    {rota.subMenus!.map((sub) => {
                        const isSubActive = abaAtual === sub.href;
                        return (
                            <Link
                                key={sub.idRota}
                                href={sub.href}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                    isSubActive
                                        ? 'text-white bg-blue-900/30 font-semibold'
                                        : 'text-gray-400 hover:bg-blue-900/30 hover:text-white'
                                }`}
                            >
                                {sub.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
