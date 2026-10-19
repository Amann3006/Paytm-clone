import { useEffect, useState, useCallback } from "react";
import { Appbar } from "../components/AppbarTemp";
import { Balance } from "../components/Balance";
import { Users } from "../components/Userstemp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
    }, [navigate]);

    // Fetch user balance
    const fetchBalance = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            handleLogout();
            return;
        }

        setLoadingBalance(true);
        try {
            const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBalance(response.data.balance);
        } catch (err) {
            console.error("Failed to fetch balance:", err);
            if (err.response?.status === 403) {
                handleLogout();
            }
        } finally {
            setLoadingBalance(false);
        }
    }, [handleLogout]);

    // Fetch current user details
    const fetchUserProfile = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            handleLogout();
            return;
        }

        try {
            const response = await axios.get("http://localhost:3000/api/v1/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.user) {
                setUser(response.data.user);
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            if (err.response?.status === 403) {
                handleLogout();
            }
        }
    }, [handleLogout]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
            return;
        }

        fetchBalance();
        fetchUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Appbar user={user} onLogout={handleLogout} />

            <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                {/* Available Balance Widget */}
                <Balance
                    value={balance}
                    loading={loadingBalance}
                    onRefresh={fetchBalance}
                />

                {/* Transfer Section & Users Directory */}
                <Users />
            </main>
        </div>
    );
};