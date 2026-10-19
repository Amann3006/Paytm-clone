import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [debouncedFilter, setDebouncedFilter] = useState("");
    const [loading, setLoading] = useState(false);

    // Debounce search input by 300ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilter(filter);
        }, 300);

        return () => clearTimeout(timer);
    }, [filter]);

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem("token");

        axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${encodeURIComponent(debouncedFilter)}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
            .then(response => {
                setUsers(response.data.user || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load users:", err);
                setUsers([]);
                setLoading(false);
            });
    }, [debouncedFilter]);

    return (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Send Money to Users</h2>
                    <p className="text-sm text-slate-500">Search and send money instantly to anyone on Paytm</p>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                    {users.length} {users.length === 1 ? 'user' : 'users'} found
                </div>
            </div>

            {/* Search input with icon */}
            <div className="relative my-3">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users by first or last name..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                />
            </div>

            {/* Users list */}
            <div className="mt-4 divide-y divide-slate-100">
                {loading ? (
                    <div className="py-12 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-2">
                        <svg className="animate-spin h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span>Searching users...</span>
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                        <svg className="mx-auto h-10 w-10 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="font-medium text-slate-600">No registered users found</p>
                        <p className="text-xs text-slate-400 mt-0.5">Try searching with a different name</p>
                    </div>
                ) : (
                    users.map(user => <User key={user._id} user={user} />)
                )}
            </div>
        </section>
    );
};

function User({ user }) {
    const navigate = useNavigate();
    const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : "U";

    return (
        <div className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
                <div className="rounded-full h-11 w-11 bg-gradient-to-br from-sky-500 to-blue-700 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                    {initial}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">
                        {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-slate-400">
                        {user.username}
                    </span>
                </div>
            </div>

            <div className="shrink-0 ml-2">
                <Button
                    onClick={() => {
                        navigate(`/send?id=${user._id}&name=${encodeURIComponent(user.firstName + ' ' + (user.lastName || ''))}`);
                    }}
                    label="Send Money"
                    variant="paytm"
                    className="!w-auto !py-2 !px-4 text-xs sm:text-sm"
                />
            </div>
        </div>
    );
}