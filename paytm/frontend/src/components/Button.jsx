export function Button({
    label,
    onClick,
    type = "button",
    disabled = false,
    loading = false,
    variant = "primary",
    className = ""
}) {
    const baseStyles = "w-full flex items-center justify-center font-medium rounded-lg text-sm px-5 py-2.5 transition-all focus:outline-none focus:ring-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 shadow-sm";

    const variants = {
        primary: "text-white bg-slate-900 hover:bg-slate-800 focus:ring-slate-300",
        paytm: "text-white bg-sky-600 hover:bg-sky-700 focus:ring-sky-200",
        success: "text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-200",
        secondary: "text-slate-700 bg-slate-100 hover:bg-slate-200 focus:ring-slate-200",
        danger: "text-white bg-rose-600 hover:bg-rose-700 focus:ring-rose-200"
    };

    const chosenVariant = variants[variant] || variants.primary;

    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled || loading}
            className={`${baseStyles} ${chosenVariant} ${className}`}
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>Processing...</span>
                </span>
            ) : (
                label
            )}
        </button>
    );
}