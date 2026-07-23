'use client'
import UserContextDTO from '@/src/modules/auth/UserContextDTO';
import { useState, createContext } from 'react';
import AuthContextDTO from '@/src/modules/auth/AuthContextDTO';
import { actionAlterarPerfil } from '@/src/modules/auth/authActions';
import { isPerfilID } from '@/src/shared/utils/PerfisEnum';
type Props = {
    children: React.ReactNode,
    initialData: UserContextDTO
}

export const AuthContext = createContext<AuthContextDTO | undefined>(undefined);

export function AuthProvider({ children, initialData }: Props) {
    const [perfilAtivo, setPerfilAtivo] = useState(initialData.perfilAtivo);

    async function alterarPerfil(novoPerfil: string) {
        const perfil = Number(novoPerfil);

        if (!isPerfilID(perfil)) {
            throw new Error('Perfil inválido');
        }

        setPerfilAtivo(perfil);

        await actionAlterarPerfil(novoPerfil)
    }
    return (
        <AuthContext.Provider
            value={{
                ...initialData,
                perfilAtivo,
                alterarPerfil
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
