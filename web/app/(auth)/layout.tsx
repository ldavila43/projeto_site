
import Image from 'next/image';

export default function AuthLayout({
    children,
    }: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
        <main className="min-h-screen flex bg-gray-100 p-6 gap-6">
            <section className="w-[65%] relative rounded-3xl overflow-hidden">

                <Image
                    src="/imagbem_test.webp"
                    alt="Imagem de cadastro"
                    fill
                    className="object-cover"
                />

            </section>
            <section className="
                w-[35%]
                bg-white
                flex
                items-center
                justify-center
                px-12
            ">
                {children}
            </section>
        </main>
    );
}