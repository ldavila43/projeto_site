// app/dashboard/paciente/loading.tsx
// Next.js shows this automatically while the async page resolves

export default function Loading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div className="h-32 bg-gray-100 rounded-xl" />
        <div className="h-32 bg-gray-100 rounded-xl" />
        <div className="h-64 bg-gray-100 rounded-xl col-span-full" />
        </div>
    );
}