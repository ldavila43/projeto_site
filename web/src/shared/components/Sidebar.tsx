'use client'
import { useContext } from 'react';
import { usePathname } from 'next/navigation'
import { AuthContext } from '@/src/shared/AuthContext';
import { actionLogout } from '@/src/modules/auth/authActions';
import { ResponseRotasPerfil } from '@/src/modules/operadores/operadoresDTO';
import MenuItem from './Menu';

interface SidebarProps {
    menuAberto: boolean;
    linksDaSidebar: ResponseRotasPerfil;
}

export default function Sidebar({ menuAberto, linksDaSidebar }: SidebarProps) {
    const contexto = useContext(AuthContext);
    const abaAtual = usePathname();

    if (!contexto) return null;

    
    return (
        <aside
            className={`
                bg-[#0A1930] h-full flex flex-col
                transition-all duration-300 ease-in-out
                text-white overflow-hidden
                ${menuAberto ? 'w-64 opacity-100' : 'w-0 opacity-0 px-0'}
            `}
        >
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-6 border-b border-gray-700/50">
                    <h1 className="font-bold text-xl tracking-wider whitespace-nowrap">BGK OMNIKA</h1>
                    <span className="text-xs text-gray-400 tracking-widest uppercase mt-1 block">
                        Plataforma
                    </span>
                </div>

                <nav className="mt-6 flex flex-col gap-2 px-4 pb-6">
                    {linksDaSidebar?.rotas?.map((rota) => (
                        <MenuItem
                            key={rota.idRota || rota.href}
                            rota={rota}
                            abaAtual={abaAtual}
                        />
                    ))}
                </nav>
            </div>

            <div className="p-6 flex flex-col gap-4 mt-auto border-t border-gray-700/50 shrink-0">
                <button
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-blue-900/50 hover:text-red-600 transition-colors"
                    onClick={actionLogout}
                >
                    Sair
                </button>
            </div>
        </aside>
    );
}
