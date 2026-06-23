import HeaderLink from '@/components/landingPage/HeaderLink'

export default function Header() {
    return (
        <header className="bg-white h-20 border-b border-gray-200 px-8 flex items-center justify-between w-full shadow-sm z-10">
            <HeaderLink
                label='Entrar'
                link='/login'
            />
            <HeaderLink
                label='Home'
                link='/'
            />
        </header>
    )
}