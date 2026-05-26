type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = '', children, ...props }: ButtonProps) {
    return (
        <button
        {...props}
        className={
            ` border
            rounded-lg
            p-2
            w-full
            invalid:border-red-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            ${className}
        `}
        >
        {children}
        </button>
    );
}