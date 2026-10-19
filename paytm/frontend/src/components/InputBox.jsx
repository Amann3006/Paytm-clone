export function InputBox({
    label,
    placeholder,
    onChange,
    type = "text",
    value,
    name,
    id,
    required = false,
    autoComplete,
    min,
    step,
    disabled = false
}) {
    const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full text-left my-2">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                min={min}
                step={step}
                disabled={disabled}
                className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
        </div>
    );
}