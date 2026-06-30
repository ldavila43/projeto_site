'use client'
import Link from 'next/link';
import { useContext } from 'react';
import { usePathname } from 'next/navigation'
import { AuthContext } from '@/src/shared/AuthContext';
import { actionLogout } from '@/src/modules/auth/authActions';
import { ResponseRotasPerfil } from '@/src/modules/operadores/operadoresDTO';

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
                text-white
                ${menuAberto ? 'w-64 opacity-100' : 'w-0 opacity-0 px-0'}
            `}
        >
            <div>
                <div className="p-6 border-b border-gray-700/50">
                    <h1 className="font-bold text-xl tracking-wider">BGK OMNIKA</h1>
                    <span className="text-xs text-gray-400 tracking-widest uppercase mt-1 block">
                        Plataforma
                    </span>
                </div>

                <nav className="mt-6 flex flex-col gap-2 px-4">
                    {linksDaSidebar?.rotas?.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${
                                link.href != abaAtual
                                ? 'px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-blue-900/50 hover:text-white transition-colors'
                                : 'px-4 py-3 rounded-lg text-sm font-medium text-white bg-blue-900/50' 
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-6 flex flex-col gap-4 mt-auto">
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