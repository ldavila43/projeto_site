'use client' // O Next.js exige que páginas de erro sejam Client Components

import { useEffect } from 'react';

// O Next.js injeta automaticamente o objeto de erro e uma função para tentar recarregar
interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorSistema({ error, reset }: ErrorPageProps) {
    
    // Logamos o erro no console para o desenvolvedor conseguir rastrear o que houve
    useEffect(() => {
        console.error('Erro capturado pelo limite de erro (Error Boundary):', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            
            <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ops! Algo deu errado.
            </h2>
            
            {/* Exibimos a mensagem exata do erro que quebrou o sistema */}
            <p className="text-gray-600 mb-8 max-w-md">
                {error.message || 'Ocorreu um erro inesperado ao carregar esta página.'}
            </p>
            
            {/* A função reset() tenta renderizar o componente que falhou novamente */}
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-[#0A1930] text-white font-medium rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tentar novamente
            </button>
            
        </div>
    );
}