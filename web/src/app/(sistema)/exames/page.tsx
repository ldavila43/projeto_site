'use client'
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/src/shared/AuthContext';
import { useRouter } from 'next/navigation'

const rotasPorPerfil = {
    0: '/exames/admin',
    1: '/exames/profissional',
    2: '/exames/colaborador',
    3: '/exames/paciente'
} as const;


export default function Exames() {
    const context = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if(!context) return;

        const perfil = rotasPorPerfil[context.perfilAtivo as keyof typeof rotasPorPerfil];
        router.replace(perfil)
    }, [context, router]);

    return null
}