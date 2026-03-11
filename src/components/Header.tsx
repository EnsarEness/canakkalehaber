"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Newspaper } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MarketTicker } from "./MarketTicker";

const categories = [
    { name: "Gündem", slug: "gundem" },
    { name: "Kültür & Sanat", slug: "kultur-sanat" },
    { name: "Spor", slug: "spor" },
    { name: "Ekonomi", slug: "ekonomi" },
    { name: "Turizm", slug: "turizm" },
];

export function Header() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [time, setTime] = useState("");
    const [dateStr, setDateStr] = useState("");

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
            setDateStr(now.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
        };
        tick();
        const id = setInterval(tick, 30000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => {
        if (mobileOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = session?.user as any;

    return (
        <>
            {/* Top bar */}
            <div className="bg-[var(--bg-surface-2)] border-b border-[var(--border)] text-[var(--text-muted)] text-[10px] font-medium px-4 py-1.5">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <span className="capitalize truncate">{dateStr}</span>
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <span>{time}</span>
                        <span className="hidden sm:inline">📍 Çanakkale, TR</span>
                    </div>
                </div>
            </div>

            <MarketTicker />

            {/* Main header */}
            <header
                className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled
                    ? "glass shadow-md"
                    : "bg-[var(--bg-surface)] border-[var(--border)]"
                    }`}
                style={{ borderColor: scrolled ? "transparent" : undefined }}
            >
                <div className="max-w-[1440px] mx-auto px-4">
                    <div className="flex items-center justify-between h-14 md:h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
                            <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                <Newspaper size={18} strokeWidth={2.5} className="text-white" />
                            </div>
                            <div className="leading-tight">
                                <span className="block text-sm font-black tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Çanakkale
                                </span>
                                <span className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)]">
                                    Haber Portalı
                                </span>
                            </div>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <Link href="/" className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] rounded-lg transition-all">
                                Ana Sayfa
                            </Link>

                            {/* Categories dropdown */}
                            <div className="relative" onMouseLeave={() => setCatOpen(false)}>
                                <button
                                    onMouseEnter={() => setCatOpen(true)}
                                    onClick={() => setCatOpen(!catOpen)}
                                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] rounded-lg transition-all"
                                >
                                    Kategoriler
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
                                </button>
                                {catOpen && (
                                    <div className="absolute top-full left-0 pt-2 z-50 animate-fade-in">
                                        <div className="glass rounded-2xl p-2 min-w-[180px] shadow-xl">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.slug}
                                                    href={`/kategori/${cat.slug}`}
                                                    onClick={() => setCatOpen(false)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] rounded-xl transition-all"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/yazarlar" className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] rounded-lg transition-all">
                                Yazarlar ✍️
                            </Link>
                            <Link href="/hakkimizda" className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] rounded-lg transition-all">
                                Hakkımızda
                            </Link>
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            {/* Theme toggle (desktop) */}
                            <div className="hidden md:block">
                                <ThemeToggle compact />
                            </div>

                            {/* Auth buttons */}
                            {session ? (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/panel"
                                        className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-3)] transition-all"
                                    >
                                        <LayoutDashboard size={14} />
                                        Panel
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        title="Çıkış Yap"
                                    >
                                        <LogOut size={15} />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/giris"
                                    className="btn-primary text-sm px-4 py-2"
                                >
                                    Giriş Yap
                                </Link>
                            )}

                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] transition-all"
                                aria-label="Menü"
                            >
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-72 z-50 flex flex-col shadow-2xl lg:hidden transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                style={{ background: "var(--bg-surface)" }}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <span className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>Menü</span>
                    <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-[var(--bg-surface-2)] transition-all">
                        <X size={18} className="text-[var(--text-muted)]" />
                    </button>
                </div>

                {/* Drawer links */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {[{ href: "/", label: "🏠 Ana Sayfa" }, { href: "/yazarlar", label: "✍️ Yazarlar" }, { href: "/hakkimizda", label: "ℹ️ Hakkımızda" }].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] transition-all"
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="pt-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)] px-4 mb-2">Kategoriler</p>
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/kategori/${cat.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center px-4 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] transition-all"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Drawer footer */}
                <div className="p-4 border-t border-[var(--border)] space-y-3">
                    <ThemeToggle />
                    {session ? (
                        <div className="flex gap-2">
                            <Link href="/panel" onClick={() => setMobileOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--bg-surface-2)] text-sm font-semibold text-[var(--text-primary)]">
                                <LayoutDashboard size={14} /> Panel
                            </Link>
                            <button onClick={() => { setMobileOpen(false); signOut(); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-sm font-semibold text-red-600">
                                <LogOut size={14} /> Çıkış
                            </button>
                        </div>
                    ) : (
                        <Link href="/giris" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center py-2.5">
                            Giriş Yap
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
