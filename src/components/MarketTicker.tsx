"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

const marketData = [
    { label: "BIST 100", value: "9.230,50", change: "+1.2%", isUp: true },
    { label: "USD/TRY", value: "32.10", change: "+0.3%", isUp: true },
    { label: "EUR/TRY", value: "34.50", change: "-0.1%", isUp: false },
    { label: "ALTIN (Gr)", value: "2.350", change: "+0.5%", isUp: true },
    { label: "BITCOIN", value: "$68.400", change: "-2.1%", isUp: false },
    { label: "PETROL", value: "$82.10", change: "+0.8%", isUp: true },
];

export function MarketTicker() {
    const [paused, setPaused] = useState(false);
    const combined = [...marketData, ...marketData, ...marketData];

    return (
        <div className="bg-[var(--bg-surface-2)] border-b border-[var(--border)] overflow-hidden">
            <div className="max-w-[1440px] mx-auto flex items-center h-[34px]">
                {/* Fixed Label */}
                <div className="flex items-center gap-1.5 px-4 h-full border-r border-[var(--border)] flex-shrink-0 text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest bg-[var(--bg-surface)] whitespace-nowrap relative z-10 shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                    Piyasalar
                </div>

                {/* Scrolling Area */}
                <div
                    className="flex-1 overflow-hidden flex relative"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div
                        className="flex items-center gap-8 whitespace-nowrap ticker-content"
                        style={{
                            animationPlayState: paused ? "paused" : "running",
                            animationDuration: "40s"
                        }}
                    >
                        {combined.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
                                <span className="text-[var(--text-muted)] font-medium">{item.label}</span>
                                <span>{item.value}</span>
                                <span className={`flex items-center gap-0.5 ${item.isUp ? "text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded" : "text-red-500 bg-red-500/10 px-1 py-0.5 rounded"}`}>
                                    {item.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                    {item.change}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
