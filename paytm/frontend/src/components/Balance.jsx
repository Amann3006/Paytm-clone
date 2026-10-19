export const Balance = ({ value, onRefresh, loading = false }) => {
  // Format number nicely
  const formatBalance = (val) => {
    if (val === null || val === undefined || val === "") return "0.00";
    const num = Number(val);
    if (isNaN(num)) return String(val);
    return num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <p className="text-sky-200 text-sm font-medium uppercase tracking-wider">Available Balance</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-light text-sky-300">₹</span>
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {loading ? "..." : formatBalance(value)}
          </span>
        </div>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Balance"
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors border border-white/15 disabled:opacity-50 cursor-pointer"
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{loading ? "Updating..." : "Refresh"}</span>
        </button>
      )}
    </div>
  );
};