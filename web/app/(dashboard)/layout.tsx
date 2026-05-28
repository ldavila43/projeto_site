import { redirect } from 'next/navigation'
import { tokenExtractor } from '@/actions/tokenAction';
import { definirHierarquia } from '@/utils/PerfisDashboard';
import PayloadUsuario from '@/DTO/PayloadUsuario';
import UserContextDTO from '@/DTO/UserContextDTO';
import { AuthProvider } from '@/contexts/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { PerfilID } from '@/utils/PerfisEnum'

export default async function DashboardLayout( { children }: Readonly<{children: React.ReactNode}> ) {

    const dadosIniciais: PayloadUsuario | null =  await tokenExtractor();

    if(!dadosIniciais) {
        return redirect('/login');
    }
    const perfilEntrada: number | null = definirHierarquia(dadosIniciais.perfis as PerfilID[])
    const contextoUsuario: UserContextDTO = {
        id: dadosIniciais.id,
        nome: dadosIniciais.nome,
        perfisDisponiveis: dadosIniciais.perfis as PerfilID[],
        perfilAtivo: perfilEntrada as PerfilID ?? null,
    }


    return (
        <AuthProvider initialData={contextoUsuario}>
            <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    )
}