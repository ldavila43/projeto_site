export default function LoginBrand() {
    return (
        <div className="relative flex flex-col justify-between min-h-full bg-[#1E3A5F] px-10 py-10 overflow-hidden">

            <div className="pointer-events-none absolute -top-16 -right-20 w-80 h-80 rounded-full border border-white/[0.07]" />
            <div className="pointer-events-none absolute -bottom-10 -left-16 w-60 h-60 rounded-full border border-white/[0.06]" />

            <div className="flex items-center gap-3 relative z-10">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1A9B8C] shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M10 3v14M3 10h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                        <circle cx="10" cy="10" r="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                    </svg>
                </div>
                <div>
                    <p className="text-white font-semibold text-[17px] leading-tight tracking-tight">
                        Biogenetika
                    </p>
                    <p className="text-white/45 text-[11px] uppercase tracking-widest mt-0.5">
                        Plataforma de Saúde
                    </p>
                </div>
            </div>

            <div className="relative z-10 space-y-4">
                <p className="text-[#1A9B8C] text-[11px] font-medium uppercase tracking-[0.1em]">
                    Acesso seguro
                </p>
                <h1 className="text-white text-[26px] font-semibold leading-snug tracking-tight">
                    Gestão clínica<br />
                    em <span className="text-[#6DD5CA]">um só lugar</span>
                </h1>
                <div className="w-10 h-0.5 bg-[#1A9B8C] rounded-full" />
                <div className="flex flex-wrap gap-2 pt-2">
                    {['Laudos', 'Exames', 'Relatórios'].map((badge) => (
                        <span
                            key={badge}
                            className="text-[11px] text-white/55 border border-white/15 px-3 py-1 rounded-full"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            {/* Rodapé */}
            <p className="relative z-10 text-white/25 text-[11px]">
                © {new Date().getFullYear()} Biogenetika
            </p>
        </div>
    );
}