'use client';
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import LoginDTO from '@/models/LoginDTO';
import { validarLogin } from '@/utils/ValidacoesLogin';
import { actionLogin } from '@/actions/authActions';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/button';
import Link from 'next/link'

export default function LoginForm() {
    const router = useRouter();

    const [formData, setFormData] = useState<LoginDTO>({
        documentoIdentificacao: '',
        senhaLogin: ''
    });

    const [submited, setSubmitted] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function enviarLogin(e: { preventDefault : () => void }) {

        e.preventDefault();
        
        setSubmitted(true);

        const validacaoLogin = validarLogin(formData)

        if (!validacaoLogin.valido){
            alert(validacaoLogin.mensagem);
            return
        }
        const mensagem = await actionLogin(formData);
        if (!mensagem.sucesso) {
            setFormData({
                documentoIdentificacao: formData.documentoIdentificacao,
                senhaLogin: ''
            });
            setSubmitted(false);
            alert(mensagem.mensagem);
            return
        }
        setFormData({
            documentoIdentificacao: '',
            senhaLogin: ''
        });
        setSubmitted(false);
        router.push('/dashboard');
    }

    return (
        <form
            onSubmit={enviarLogin}
            className="w-full max-w-sm flex flex-col"
        >
            <div className='flex flex-col gap-4'>

                <h1 className="text-3xl font-bold text-center">Entrar</h1>
                    <div className='flex flex-col gap-2'>
                        <span>
                            Usuario:
                        </span>
                        <Input required name="documentoIdentificacao" className={submited && !formData.documentoIdentificacao ? 'border-red-500': ''} value={formData.documentoIdentificacao} onChange={handleChange} />
                        <span>Senha:</span>
                        <Input required name="senhaLogin" type='password' className={submited && !formData.senhaLogin ? 'border-red-500': ''} value={formData.senhaLogin} onChange={handleChange} />
                        <Button className='bg-[#1E3A5F] text-white hover:bg-[#2E6DA4] w-full' type="submit">Fazer Login</Button>
                        <Link className='text-center' href="/register">cadastre-se</Link>
                    </div>
            </div>
        </form>
    );
}