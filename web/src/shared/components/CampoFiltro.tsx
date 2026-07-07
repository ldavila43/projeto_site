interface CampoFiltroProps {
    label: string;
    id: string;
    name: string;
    value?: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function CampoFiltro({
    label,
    id,
    name,
    value,
    onChange,
}: CampoFiltroProps) {
    return (
        <div className="flex flex-col">
        <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
        >
            {label}
        </label>

        <input
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className="border rounded-md p-2 text-sm"
        />
        </div>
    );
}