import { redirect } from 'next/navigation'
import UserContextDTO from '@/src/modules/auth/UserContextDTO';
import { AuthProvider } from '@/src/shared/AuthContext';
import DashboardShell from '@/src/shared/components/DashboardShell';
import { buscaRotasOperadores } from '@/src/modules/operadores/operadoresActions';
import { obterSessao } from '@/src/shared/server/sessao';

export default async function DashboardLayout({ children }: Readonly<{children: React.ReactNode}>) {

    const sessao = await obterSessao().catch(() => null);

    if (!sessao || !sessao.perfilAtivo) {
        return redirect('/login');
    }

    const linksDaSidebar = await buscaRotasOperadores();

    const contextoUsuario: UserContextDTO = {
        id: sessao.usuario.id,
        nome: sessao.usuario.nome,
        perfisDisponiveis: sessao.usuario.perfis,
        perfilAtivo: sessao.perfilAtivo,
    }

    return (
        <AuthProvider initialData={contextoUsuario}>
            <DashboardShell linksDaSidebar={linksDaSidebar}>
                {children}
            </DashboardShell>
        </AuthProvider>
    )
}
