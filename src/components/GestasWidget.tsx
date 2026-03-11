"use client";

import { useState, useEffect } from "react";
import { Anchor, ChevronRight, ChevronDown, Clock } from "lucide-react";

type RouteKey = "eceabat" | "kilitbahir";
type Direction = "from" | "to";

const SCHEDULES: Record<RouteKey, Record<Direction, string[]>> = {
    eceabat: {
        from: ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "14:00", "15:00", "15:30", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
        to: ["07:15", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "14:00", "15:00", "16:00", "16:30", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    },
    kilitbahir: {
        from: ["07:00", "08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00", "21:30", "22:30"],
        to: ["07:30", "08:45", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "20:30", "22:00", "23:00"],
    },
};

function getNextDepartures(times: string[]): { next: string | null; upcoming: string[] } {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const future = times.filter((t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m > currentMins;
    });
    return { next: future[0] ?? null, upcoming: future.slice(0, 3) };
}

export function GestasWidget() {
    const [route, setRoute] = useState<RouteKey>("eceabat");
    const [dir, setDir] = useState<Direction>("from");
    const [expanded, setExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const times = SCHEDULES[route][dir];
    const { next, upcoming } = mounted ? getNextDepartures(times) : { next: times[0], upcoming: times.slice(0, 3) };
    const visible = expanded ? times : times.slice(0, 8);

    const dirLabel = dir === "from"
        ? `Çanakkale → ${route === "eceabat" ? "Eceabat" : "Kilitbahir"}`
        : `${route === "eceabat" ? "Eceabat" : "Kilitbahir"} → Çanakkale`;

    return (
        <div className="rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            {/* Header */}
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Anchor size={16} className="text-blue-500" />
                        <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Gestaş Seferleri</p>
                            <p className="text-[10px] font-medium text-[var(--accent)] uppercase tracking-wide">Güncel Saatler</p>
                        </div>
                    </div>
                </div>
                {/* Route tabs */}
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-surface-2)" }}>
                    {(["eceabat", "kilitbahir"] as RouteKey[]).map((r) => (
                        <button key={r} onClick={() => setRoute(r)}
                            className="flex-1 py-1.5 text-[10px] font-bold rounded-lg capitalize transition-all"
                            style={{
                                background: route === r ? "var(--bg-surface)" : "transparent",
                                color: route === r ? "var(--text-primary)" : "var(--text-muted)",
                                boxShadow: route === r ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                            }}>
                            {r === "eceabat" ? "Eceabat" : "Kilitbahir"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 py-4">
                {/* Direction */}
                <div className="flex gap-1.5 mb-4">
                    {(["from", "to"] as Direction[]).map((d) => {
                        const label = d === "from"
                            ? `→ ${route === "eceabat" ? "Eceabat" : "Kilitbahir"}`
                            : `← Çanakkale`;
                        return (
                            <button key={d} onClick={() => setDir(d)}
                                className="flex-1 text-[10px] py-1.5 rounded-xl font-bold transition-all border"
                                style={{
                                    background: dir === d ? "rgba(59,130,246,0.08)" : "var(--bg-surface)",
                                    color: dir === d ? "rgb(37,99,235)" : "var(--text-muted)",
                                    borderColor: dir === d ? "rgba(59,130,246,0.2)" : "var(--border)",
                                }}>
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Next departure highlight */}
                {next && (
                    <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-4 shadow-sm" style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.15)" }}>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wide">Sonraki Sefer</p>
                        </div>
                        <p className="text-blue-600 font-black text-2xl leading-none tracking-tighter">{next}</p>
                    </div>
                )}

                {/* Schedule grid */}
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                    {visible.map((t) => {
                        const isNext = t === next;
                        const [h, m] = t.split(":").map(Number);
                        const isPast = mounted && (h * 60 + m) < (new Date().getHours() * 60 + new Date().getMinutes());
                        return (
                            <div key={t}
                                className={`text-center py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${isNext ? 'border-blue-200' : 'border-transparent'
                                    }`}
                                style={{
                                    background: isNext ? "rgba(59,130,246,0.08)" : "var(--bg-surface-2)",
                                    color: isNext ? "rgb(37,99,235)" : isPast ? "var(--text-faint)" : "var(--text-secondary)",
                                    opacity: isPast ? 0.6 : 1
                                }}>
                                {t}
                            </div>
                        );
                    })}
                </div>

                <button onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors py-2 rounded-lg hover:bg-[var(--bg-surface-2)] mt-2">
                    {expanded ? <><ChevronDown size={14} /> Daha az göster</> : <><ChevronRight size={14} /> Tüm seferler ({times.length})</>}
                </button>

                <p className="text-[var(--text-faint)] font-medium text-[9px] text-center mt-3">Kaynak: gestasulasim.com.tr</p>
            </div>
        </div>
    );
}
