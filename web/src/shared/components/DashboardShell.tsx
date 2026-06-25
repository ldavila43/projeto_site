'use client'

import { useState } from 'react';
import Sidebar from '@/src/shared/components/Sidebar';
import Header from '@/src/shared/components/Header';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [menuAberto, setMenuAberto] = useState(true);

    function toggleMenu() {
        setMenuAberto(!menuAberto);
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
            <Sidebar menuAberto={menuAberto} />
            
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header toggleMenu={toggleMenu} />
                
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}