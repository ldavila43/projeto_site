'use client'

import Link from 'next/link';

interface ButtonProps {
    label: string,
    link: string
}

export default function HeaderLink({label, link}: ButtonProps) {
    return(
        <Link
            key={link}
            href={link}
        >
        {label}
        </Link>
    )
}