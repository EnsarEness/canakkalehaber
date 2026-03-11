"use client";

import { useEffect, useState } from "react";
import { Pill, Phone, MapPin, RefreshCw, ExternalLink, ChevronDown } from "lucide-react";

interface Eczane {
    ad: string;
    adres: string;
    tel: string;
    harita: string;
}

interface EczaneData {
    tarih: string;
    eczaneler: Eczane[];
    kaynak: string;
    not: string;
}

export function EczaneWidget() {
    const [data, setData] = useState<EczaneData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/eczaneler")
            .then((r) => r.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                    <span className="text-xl drop-shadow-sm">💊</span>
                    <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">
                            Nöbetçi Eczane
                        </p>
                        {data && (
                            <p className="text-[10px] font-medium text-[var(--accent)] uppercase tracking-wide">{data.tarih}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Güncel
                </div>
            </div>

            <div className="p-4">
                {loading ? (
                    <div className="flex items-center justify-center py-8 gap-2" style={{ color: "var(--text-faint)" }}>
                        <RefreshCw size={16} className="animate-spin" />
                        <span className="text-sm font-medium">Yükleniyor...</span>
                    </div>
                ) : data ? (
                    <div className="space-y-3">
                        {data.eczaneler.map((eczane) => (
                            <div
                                key={eczane.ad}
                                className="border rounded-xl overflow-hidden transition-all hover:border-[var(--border-strong)]" style={{ borderColor: "var(--border)" }}
                            >
                                {/* Card header */}
                                <button
                                    onClick={() => setExpanded(expanded === eczane.ad ? null : eczane.ad)}
                                    className="w-full flex items-center justify-between p-3 transition-colors text-left" style={{ background: "var(--bg-surface)" }}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-50">
                                            <Pill size={16} className="text-emerald-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold truncate text-[var(--text-primary)]">{eczane.ad}</p>
                                            <p className="text-[11px] truncate text-[var(--text-muted)]">{eczane.adres}</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`ml-2 transition-transform flex-shrink-0 ${expanded === eczane.ad ? "rotate-180" : ""}`}
                                    >
                                        <ChevronDown size={14} className="text-[var(--text-faint)]" />
                                    </div>
                                </button>

                                {/* Expanded detail */}
                                {expanded === eczane.ad && (
                                    <div className="px-3 pb-3 space-y-2 border-t" style={{ borderColor: "var(--border)", background: "var(--bg-surface-2)" }}>
                                        <div className="flex items-start gap-2 pt-3">
                                            <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--text-faint)" }} />
                                            <p className="text-[11px] leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>{eczane.adres}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <a
                                                href={`tel:${eczane.tel.replace(/\s/g, "")}`}
                                                className="flex items-center gap-1.5 text-white text-[11px] font-bold px-3 py-2 rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                                            >
                                                <Phone size={12} />
                                                {eczane.tel}
                                            </a>
                                            <a
                                                href={eczane.harita}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-lg transition-colors border hover:bg-[var(--bg-surface)] bg-transparent shadow-sm"
                                                style={{ color: "var(--text-secondary)", borderColor: "var(--border-strong)" }}
                                            >
                                                <MapPin size={12} />
                                                Haritada Aç
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Disclaimer */}
                        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 mt-4">
                            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                                ⚠️ {data.not}
                            </p>
                        </div>

                        <a
                            href="https://www.canakkale.gov.tr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 mt-2 transition-colors rounded-lg hover:bg-[var(--bg-surface-2)]" style={{ color: "var(--text-muted)" }}
                        >
                            Resmi Listeye Git <ExternalLink size={12} />
                        </a>
                    </div>
                ) : (
                    <div className="text-center py-6 text-[var(--text-muted)] text-sm font-medium">
                        Eczane bilgisi alınamadı
                    </div>
                )}
            </div>
        </div>
    );
}
