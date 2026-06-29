import { X } from 'lucide-react';

interface TagProps {
    label: string;
    onRemove: () => void;
}

function TagItem({ label, onRemove }: TagProps) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-900 focus:outline-none"
            >
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}