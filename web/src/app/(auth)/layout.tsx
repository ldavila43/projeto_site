import LoginBrand from '@/src/modules/auth/components/forms/LoginBrand'


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[42%_1fr] h-screen">
            <div className="hidden lg:block ">
                <LoginBrand />
            </div>
            <div className="h-full overflow-y-auto px-6 lg:px-10 col-span-2 lg:col-span-1">
                <div className="min-h-full flex items-center justify-center ">
                    {children}
                </div>
            </div>
        </div>
    );
}