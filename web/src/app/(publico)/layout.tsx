import Header from '@/components/landingPage/Header'

export default function LayoutPage({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}