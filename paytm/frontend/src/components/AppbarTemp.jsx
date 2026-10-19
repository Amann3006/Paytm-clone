export const Appbar = ({ user, onLogout }) => {
    const displayName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : "User";

    const initial = user?.firstName
        ? user.firstName.charAt(0).toUpperCase()
        : "U";

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-sky-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-black text-lg tracking-tighter">P</span>
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-slate-900">
                        Pay<span className="text-sky-600">tm</span>
                    </span>
                    <span className="ml-1 text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
                        Wallet
                    </span>
                </div>

                {/* User section & Logout */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800 leading-none">
                                {displayName}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 leading-none">
                                {user?.username || ""}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-inner">
                            {initial}
                        </div>
                    </div>

                    {onLogout && (
                        <button
                            onClick={onLogout}
                            type="button"
                            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="Sign out of your account"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};