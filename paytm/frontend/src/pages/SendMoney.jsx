import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { useState, useEffect } from 'react';
import { Button } from "../components/Button";

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id");
    const name = searchParams.get("name") || "Recipient";

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
        }
    }, [navigate]);

    const handleTransfer = async (e) => {
        e?.preventDefault();
        setError("");
        setSuccessMessage("");

        const numAmount = Number(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount greater than 0.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount: numAmount
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSuccessMessage(response.data.message || `Successfully sent ₹${numAmount.toLocaleString('en-IN')}!`);
            setAmount("");
        } catch (err) {
            console.error("Transfer error:", err);
            const serverMsg = err.response?.data?.message || "Failed to complete the transfer. Please try again.";
            setError(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    const initial = name ? name.trim().charAt(0).toUpperCase() : "U";

    if (!id) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-slate-200">
                    <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No Recipient Selected</h2>
                    <p className="text-sm text-slate-500 mb-6">Please select a user from the dashboard directory to transfer money.</p>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-100 p-4">
            {/* Top Brand Logo */}
            <div className="text-center mb-6">
                <Link to="/dashboard" className="inline-flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                        P
                    </div>
                    <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
                        Pay<span className="text-sky-600">tm</span>
                    </span>
                </Link>
            </div>

            <div className="w-full max-w-md bg-white border border-slate-200/90 shadow-xl rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Transfer Money</h2>
                        <p className="text-xs text-slate-500">Instant UPI & wallet payment</p>
                    </div>
                    <Link
                        to="/dashboard"
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
                        title="Cancel transfer"
                    >
                        Cancel
                    </Link>
                </div>

                <div className="p-6">
                    {/* Recipient Profile Card */}
                    <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-blue-700 text-white font-bold text-lg flex items-center justify-center shadow-sm shrink-0">
                            {initial}
                        </div>
                        <div className="overflow-hidden">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Paying to</span>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">{name}</h3>
                        </div>
                    </div>

                    {/* Success Banner */}
                    {successMessage && (
                        <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center animate-fade-in">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2.5">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-emerald-900">Transfer Successful</h3>
                            <p className="text-sm text-emerald-700 mt-1">{successMessage}</p>
                            
                            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                                <button
                                    onClick={() => setSuccessMessage("")}
                                    type="button"
                                    className="flex-1 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer"
                                >
                                    Send More Money
                                </button>
                                <Link
                                    to="/dashboard"
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
                                >
                                    Back to Dashboard
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-2.5">
                            <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Transfer Form */}
                    {!successMessage && (
                        <form onSubmit={handleTransfer} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="transfer-amount"
                                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                                >
                                    Amount (in ₹)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-lg">
                                        ₹
                                    </div>
                                    <input
                                        id="transfer-amount"
                                        type="number"
                                        min="1"
                                        step="any"
                                        required
                                        autoFocus
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 text-base font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl shadow-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    label="Initiate Transfer"
                                    variant="paytm"
                                    loading={loading}
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};