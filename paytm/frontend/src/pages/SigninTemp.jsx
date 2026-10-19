import { useState, useEffect } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignin = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in both email and password.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                username: username.trim().toLowerCase(),
                password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                if (response.data.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }
                navigate("/dashboard");
            } else {
                setError("Invalid response from server. Please try again.");
            }
        } catch (err) {
            console.error("Sign in failed:", err);
            const serverMessage = err.response?.data?.message || "Invalid email or password. Please try again.";
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Paytm Brand Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-sky-600 text-white font-black text-2xl shadow-md mb-2">
                        P
                    </div>
                    <div className="font-extrabold text-2xl text-slate-900 tracking-tight">
                        Pay<span className="text-sky-600">tm</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <Heading label="Sign In" />
                        <SubHeading label="Enter your credentials to access your Paytm account" />
                    </div>

                    {error && (
                        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-2.5">
                            <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignin} className="space-y-4">
                        <InputBox
                            label="Email Address"
                            type="email"
                            name="email"
                            autoComplete="username"
                            required
                            placeholder="name@example.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <InputBox
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            required
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                label="Sign In"
                                variant="paytm"
                                loading={loading}
                            />
                        </div>
                    </form>

                    <BottomWarning
                        label="Don't have an account?"
                        buttonText="Create an account"
                        to="/signup"
                    />
                </div>
            </div>
        </div>
    );
};