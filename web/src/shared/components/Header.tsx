'use client'

import { PERFIS_INFO } from '@/src/shared/utils/PerfisEnum';
import { definirPerfis } from '@/src/shared/utils/PerfisDashboard';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { actionLogout } from '@/src/modules/auth/authActions';
import { AuthContext } from '@/src/shared/AuthContext';

const rotasPorPerfil = {
    0: '/dashboard/admin',
    1: '/dashboard/profissional',
    2: '/dashboard/colaborador',
    3: '/dashboard/paciente'
} as const;

export default function Header( {toggleMenu}: {toggleMenu:() => void} ) {
    const contexto = useContext(AuthContext);
    const router = useRouter();
    if (!contexto) return null;
    const { nome, perfilAtivo, perfisDisponiveis } = contexto;

    const perfisParaExibir =
    definirPerfis(perfisDisponiveis);

    function handleTrocaPerfil(novoPerfil: string) {
        if(!contexto) {
            router.replace('/login');
            return null;
        };
        contexto.alterarPerfil(novoPerfil);
        const idRota = Number(novoPerfil)
        const novaRota = rotasPorPerfil[idRota as keyof typeof rotasPorPerfil];
        router.push(novaRota)
    }

    const nomePerfil =
        perfilAtivo !== null
        ? PERFIS_INFO[perfilAtivo].nome
        : '';

    return (
        <header className="bg-white h-20 border-b border-gray-200 px-8 flex items-center justify-between w-full shadow-sm z-10">
            <div>
                <button
                    onClick={toggleMenu}
                    className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            <div>
                <select
                    key={perfilAtivo}
                    value={String(perfilAtivo ?? '')}
                    onChange={e => {
                        handleTrocaPerfil(e.target.value)
                    }}>
                    {perfisParaExibir.map((perfil) => (
                        <option key={perfil} value={String(perfil)}>{PERFIS_INFO[perfil].nome}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#14b8a6] text-white flex items-center justify-center font-bold text-lg shadow-inner">
                        {nome ? nome.charAt(0).toUpperCase() : 'U'}
                    </div>
                    
                    <div className="flex flex-col text-right">
                        <span className="text-sm font-bold text-[#0A1930]">{nome}</span>
                        <span className="text-xs text-gray-500 font-medium">
                            {nomePerfil}
                        </span>
                    </div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <button
                    onClick={actionLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                    <span>Sair</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
                
            </div>
        </header>
    )
}