'use client'
import { PerfilID } from '@/utils/PerfisEnum'
import UserContextDTO from '@/DTO/UserContextDTO';
import { useState, createContext } from 'react';
import AuthContextDTO from '@/DTO/AuthContextDTO';

type Props = {
    children: React.ReactNode,
    initialData: UserContextDTO
}

export const AuthContext = createContext<AuthContextDTO | undefined>(undefined);

export function AuthProvider({ children, initialData }: Props) {
    const [perfilAtivo, setPerfilAtivo] = useState(initialData.perfilAtivo);

    function alterarPerfil(novoPerfil: string) {
        const perfil = Number(novoPerfil)
        if (Number.isNaN(perfil)){
            throw new Error('Perfil Inválido');
        }
        setPerfilAtivo(perfil as PerfilID);
    }

    return (
        <AuthContext.Provider
            value={{
                ...initialData,
                perfilAtivo,
                alterarPerfil
            }}>{children}</AuthContext.Provider>
    )
}