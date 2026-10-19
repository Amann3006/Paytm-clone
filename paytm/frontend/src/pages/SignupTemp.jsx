import { useState, useEffect } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!firstName.trim() || !lastName.trim() || !username.trim() || !password) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                username: username.trim().toLowerCase(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                if (response.data.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }
                navigate("/dashboard");
            } else {
                setError("Account created but failed to retrieve session. Please sign in.");
            }
        } catch (err) {
            console.error("Signup failed:", err);
            const serverMessage = err.response?.data?.message || "Registration failed. Please check your inputs.";
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
                    <div className="text-center mb-4">
                        <Heading label="Create Account" />
                        <SubHeading label="Sign up to start sending and receiving money with Paytm" />
                    </div>

                    {error && (
                        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-2.5">
                            <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputBox
                                label="First Name"
                                placeholder="John"
                                name="given-name"
                                autoComplete="given-name"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <InputBox
                                label="Last Name"
                                placeholder="Doe"
                                name="family-name"
                                autoComplete="family-name"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <InputBox
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            name="email"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <InputBox
                            label="Password"
                            type="password"
                            placeholder="At least 6 characters"
                            name="new-password"
                            autoComplete="new-password"
                            required
                            min="6"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="pt-3">
                            <Button
                                type="submit"
                                label="Create Account"
                                variant="paytm"
                                loading={loading}
                            />
                        </div>
                    </form>

                    <BottomWarning
                        label="Already have an account?"
                        buttonText="Sign in"
                        to="/signin"
                    />
                </div>
            </div>
        </div>
    );
};