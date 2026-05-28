'use server'

import { cookies } from 'next/headers'
import PayloadUsuario from '@/DTO/PayloadUsuario';
import { jwtDecode } from 'jwt-decode';

export async function tokenExtractor() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if(!token) {
        return null

    }

    try {
        const payload = jwtDecode<PayloadUsuario>(token);
        return payload;
    } catch {
        return null
    }
}