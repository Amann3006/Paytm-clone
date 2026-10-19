import { Link } from "react-router-dom";

export function BottomWarning({ label, buttonText, to }) {
    return (
        <div className="pt-4 pb-2 text-sm text-slate-600 flex justify-center items-center gap-1">
            <span>{label}</span>
            <Link
                to={to}
                className="font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors cursor-pointer"
            >
                {buttonText}
            </Link>
        </div>
    );
}