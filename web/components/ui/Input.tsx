type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
    className = '',
    ...props
}: InputProps) {
    return (
        <input
            {...props}
            className={`
                border
                rounded-lg
                p-2
                w-full
                ${className}
            `}
        />
    );
}