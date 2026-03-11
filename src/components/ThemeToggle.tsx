"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="w-9 h-9" />;

    const themes: { key: string; icon: React.ReactNode; label: string }[] = [
        { key: "light", icon: <Sun size={14} />, label: "Açık" },
        { key: "dark", icon: <Moon size={14} />, label: "Koyu" },
        { key: "system", icon: <Monitor size={14} />, label: "Sistem" },
    ];

    if (compact) {
        const next = theme === "dark" ? "light" : "dark";
        return (
            <button
                onClick={() => setTheme(next)}
                className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-surface-2)] transition-all text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                title={next === "dark" ? "Karanlık moda geç" : "Aydınlık moda geç"}
                aria-label="Toggle theme"
            >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
        );
    }

    return (
        <div className="flex items-center gap-0.5 p-0.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)]">
            {themes.map(({ key, icon, label }) => (
                <button
                    key={key}
                    onClick={() => setTheme(key)}
                    title={label}
                    aria-label={label}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${theme === key
                        ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        }`}
                >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                </button>
            ))}
        </div>
    );
}
