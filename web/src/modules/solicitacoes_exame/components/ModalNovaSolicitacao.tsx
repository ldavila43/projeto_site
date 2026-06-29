'use client'
import { X } from 'lucide-react';
import TemplateNovaSolicitacao from './TemplateNovaSolicitacao'; // O form que acabamos de criar

interface ModalNovaSolicitacaoProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalNovaSolicitacao({ isOpen, onClose }: ModalNovaSolicitacaoProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-gray-50 rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col relative">
                
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 bg-white rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 shadow-sm transition-colors"
                        title="Fechar formulário"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 md:p-6 w-full">
                    <TemplateNovaSolicitacao />
                </div>
            </div>
        </div>
    );
}