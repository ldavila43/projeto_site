'use client'

import { PERFIS } from '@/utils/PerfisEnum';
import Link from 'next/link';
import { useContext } from 'react';
import { usePathname } from 'next/navigation'
import { AuthContext } from '@/contexts/AuthContext';

interface SidebarProps {
    menuAberto: boolean
}

const MENU_POR_PERFIL: Record<number, { label: string; href: string}[]> = {
    [PERFIS.PACIENTE]: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Exames', href: '/exames' }
    ],
    [PERFIS.PROFISSIONAL_SAUDE]: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Pacientes', href: '/pacientes' },
        { label: 'Exames', href: '/exames' },
        { label: 'Nova Análise', href: '/analise' }
    ],
    [PERFIS.ADMIN]: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Cadastros', href: '/cadastros' },
        { label: 'Exames', href: '/exames' },
        { label: 'Pacientes', href: '/pacientes' },
        { label: 'Nova Análise', href: '/analise' }
    ]
};

export default function Sidebar({ menuAberto }: SidebarProps) {
    const contexto = useContext(AuthContext);
    const abaAtual = usePathname();
    if (!contexto) return null;
    const { perfilAtivo } = contexto;

    const linksDaSidebar =
        perfilAtivo !== null
            ? MENU_POR_PERFIL[perfilAtivo] || []
            : [];

    return (
        <aside
            // className="w-64 bg-[#0A1930] text-white flex flex-col h-screen justify-between"
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
                    {linksDaSidebar.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${
                                link.href != abaAtual
                                ? 'px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-blue-900/50 hover:text-white transition-colors'
                                : 'px-4 py-3 rounded-lg text-sm font-medium text-white bg-blue-900/50' }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>🇧🇷 PT-BR</span>
                </div>
                
                <button className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Sair
                </button>
            </div>
        </aside>
    );
}