"use client";

import { useEffect, useState } from "react";
import { Wind, Droplets, Thermometer, RefreshCw, ArrowUpCircle } from "lucide-react";

interface WeatherData {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    windDirectionName: string;
    windSeverity: "normal" | "gusty" | "strong" | "storm";
    weatherCode: number;
    updatedAt: string;
}

function getWeatherEmoji(code: number): string {
    if (code === 0) return "☀️";
    if (code <= 2) return "⛅";
    if (code <= 48) return "☁️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌦️";
    return "⛈️";
}

function getWeatherLabel(code: number): string {
    if (code === 0) return "Açık";
    if (code <= 2) return "Parçalı Bulutlu";
    if (code <= 48) return "Kapalı";
    if (code <= 67) return "Yağmurlu";
    if (code <= 77) return "Karlı";
    if (code <= 82) return "Sağanak";
    return "Fırtınalı";
}

const severityConfig = {
    normal: { label: "Normal", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
    gusty: { label: "Rüzgarlı", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
    strong: { label: "Kuvvetli", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
    storm: { label: "⚠️ Fırtına", color: "#DC2626", bg: "rgba(220,38,38,0.20)" },
};

// Wind compass arrow – rotates to point direction wind IS COMING FROM
function WindArrow({ deg }: { deg: number }) {
    return (
        <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full" style={{ border: "1px solid var(--border)" }} />
            <div style={{ transform: `rotate(${deg}deg)`, color: "var(--accent)", lineHeight: 0 }}>
                <ArrowUpCircle size={18} strokeWidth={2} />
            </div>
        </div>
    );
}

export function WeatherWidget() {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/weather", { cache: "no-store" });
            if (res.ok) setData(await res.json());
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const sev = data ? severityConfig[data.windSeverity] : null;

    return (
        <div className="rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                    <span className="text-xl">🌊</span>
                    <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">Hava Durumu</p>
                        <p className="text-[10px] font-medium text-[var(--accent)] uppercase tracking-wide">Çanakkale</p>
                    </div>
                </div>
                <button onClick={fetchData} className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-surface-2)]">
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {loading && !data ? (
                <div className="px-4 py-8 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
                </div>
            ) : data ? (
                <div className="px-4 py-4">
                    {/* Temp row */}
                    <div className="flex items-center justify-between xl mb-5">
                        <div className="flex items-end gap-2 text-[var(--text-primary)]">
                            <span className="text-5xl font-black leading-none tracking-tighter">{Math.round(data.temperature)}°</span>
                            <span className="text-[var(--text-muted)] text-sm font-medium mb-1.5">{getWeatherLabel(data.weatherCode)}</span>
                        </div>
                        <span className="text-4xl drop-shadow-sm">{getWeatherEmoji(data.weatherCode)}</span>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="rounded-xl border p-2.5 text-center transition-colors hover:border-blue-200" style={{ background: "var(--bg-surface-2)", borderColor: "var(--border)" }}>
                            <Droplets size={14} className="mx-auto mb-1 text-blue-500" />
                            <p className="text-xs font-bold text-[var(--text-primary)]">{data.humidity}%</p>
                            <p className="text-[10px] text-[var(--text-muted)] font-medium">Nem</p>
                        </div>
                        <div className="rounded-xl border p-2.5 text-center transition-colors hover:border-orange-200" style={{ background: "var(--bg-surface-2)", borderColor: "var(--border)" }}>
                            <Thermometer size={14} className="mx-auto mb-1 text-orange-500" />
                            <p className="text-xs font-bold text-[var(--text-primary)]">{Math.round(data.feelsLike)}°</p>
                            <p className="text-[10px] text-[var(--text-muted)] font-medium">Hissedilen</p>
                        </div>
                        <div className="rounded-xl border p-2.5 text-center transition-colors hover:border-sky-200" style={{ background: "var(--bg-surface-2)", borderColor: "var(--border)" }}>
                            <Wind size={14} className="mx-auto mb-1 text-sky-500" />
                            <p className="text-xs font-bold text-[var(--text-primary)]">{Math.round(data.windSpeed)}</p>
                            <p className="text-[10px] text-[var(--text-muted)] font-medium">km/s</p>
                        </div>
                    </div>

                    {/* Wind direction + severity */}
                    <div className="flex items-center justify-between rounded-xl px-4 py-2.5 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-3">
                            <WindArrow deg={data.windDirection} />
                            <div>
                                <p className="text-xs font-bold text-[var(--text-primary)]">{data.windDirectionName}</p>
                                <p className="text-[10px] font-medium text-[var(--text-muted)]">Rüzgar yönü</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-black/5" style={{ background: sev!.bg, color: sev!.color }}>
                            {sev!.label}
                        </span>
                    </div>

                    <p className="text-[var(--text-faint)] font-medium text-[9px] text-right mt-3">Kaynak: Open-Meteo · {data.updatedAt}</p>
                </div>
            ) : (
                <div className="px-4 py-6 text-center">
                    <p className="text-[var(--text-muted)] text-xs font-medium">Hava durumu alınamadı</p>
                </div>
            )}
        </div>
    );
}
