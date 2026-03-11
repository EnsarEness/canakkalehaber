"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Newspaper, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
        } else {
            router.push("/panel");
            router.refresh();
        }
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#1a2744] via-[#243561] to-[#c8102e]">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
                        <Newspaper size={36} className="text-white" />
                    </div>
                    <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Çanakkale Haber Portalı
                    </h1>
                    <p className="text-white/60 text-sm mt-1">Panele giriş yapın</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                E-posta Adresi
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ornek@canakkale-haber.com"
                                    required
                                    className="input-field !pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="input-field !pl-10 !pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-700 to-red-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-red-800 hover:to-red-700 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Giriş yapılıyor...
                                </span>
                            ) : (
                                "Giriş Yap"
                            )}
                        </button>
                    </form>

                    {/* Test hesapları */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl text-xs text-blue-700">
                        <p className="font-bold mb-2">🧪 Test Hesapları (Şifre: password123):</p>
                        <ul className="space-y-1 ml-4 list-disc">
                            <li><strong>Admin:</strong> admin@canakkale.com</li>
                            <li><strong>Yazar:</strong> fatma@canakkale.com</li>
                            <li><strong>Yazar:</strong> mehmet@canakkale.com</li>
                            <li><strong>Yazar:</strong> elif@canakkale.com</li>
                        </ul>
                    </div>
                </div>

                <p className="text-center mt-6 text-white/60 text-sm">
                    <Link href="/" className="hover:text-white transition-colors">
                        ← Ana sayfaya dön
                    </Link>
                </p>
            </div>
        </div>
    );
}
