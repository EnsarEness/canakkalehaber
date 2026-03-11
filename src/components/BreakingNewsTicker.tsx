"use client";

import { useEffect, useRef, useState } from "react";
import { Radio, AlertCircle } from "lucide-react";

interface BreakingNewsTickerProps {
    items: string[];
}

export function BreakingNewsTicker({ items }: BreakingNewsTickerProps) {
    const [paused, setPaused] = useState(false);
    const tickerRef = useRef<HTMLDivElement>(null);

    if (!items.length) return null;

    const combined = [...items, ...items]; // duplicate for seamless loop

    return (
        <div
            className="border-b overflow-hidden"
            style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border)",
            }}
        >
            <div className="max-w-full flex items-center" style={{ height: 38 }}>
                {/* Label */}
                <div
                    className="flex items-center gap-2 px-4 flex-shrink-0 border-r border-white/20 h-full"
                    style={{ minWidth: 120 }}
                >
                    <span className="pulse-dot" /> {/* uses background red by default from globals.css */}
                    <span className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Radio size={12} />
                        Son Dakika
                    </span>
                </div>

                {/* Ticker */}
                <div
                    className="flex-1 overflow-hidden relative"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div
                        ref={tickerRef}
                        className="flex items-center gap-8 whitespace-nowrap ticker-content"
                        style={{
                            animationPlayState: paused ? "paused" : "running",
                        }}
                    >
                        {combined.map((item, i) => (
                            <span key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                <span className="text-[var(--text-faint)] mx-2">•</span>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
