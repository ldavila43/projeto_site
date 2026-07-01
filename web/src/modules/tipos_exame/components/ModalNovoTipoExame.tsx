'use client'
import { X } from 'lucide-react';
import TemplateNovoTipoExame from './TemplateNovoTipoExame';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalNovoTipoExame({ isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-20"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="overflow-y-auto p-2">
                    <TemplateNovoTipoExame />
                </div>
            </div>
        </div>
    );
}