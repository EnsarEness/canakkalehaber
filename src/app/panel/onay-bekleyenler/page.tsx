"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, RefreshCw, Calendar, User } from "lucide-react";

interface News {
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    createdAt: string;
    author: { name: string; email: string };
    category: { name: string; color: string };
}

export default function OnayBekleyenlerPage() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    async function fetchPending() {
        setLoading(true);
        const res = await fetch("/api/news?status=PENDING&limit=50");
        const data = await res.json();
        setNews(data.news || []);
        setLoading(false);
    }

    useEffect(() => { fetchPending(); }, []);

    async function approve(id: string) {
        setProcessing(id);
        await fetch(`/api/news/${id}/approve`, { method: "PATCH" });
        setNews((prev) => prev.filter((n) => n.id !== id));
        setProcessing(null);
    }

    async function reject(id: string) {
        setProcessing(id);
        await fetch(`/api/news/${id}/reject`, { method: "PATCH" });
        setNews((prev) => prev.filter((n) => n.id !== id));
        setProcessing(null);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Onay Bekleyen Haberler
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {news.length} haber onay bekliyor
                    </p>
                </div>
                <button
                    onClick={fetchPending}
                    className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw size={14} />
                    Yenile
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                    <RefreshCw size={18} className="animate-spin" /> Yükleniyor...
                </div>
            ) : news.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-5xl mb-4">✅</p>
                    <p className="font-semibold text-gray-700">Onay bekleyen haber yok!</p>
                    <p className="text-sm text-gray-400 mt-1">Tüm haberler incelendi.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {news.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                        >
                            <div className="flex gap-4 p-5">
                                {/* Thumbnail */}
                                {item.coverImage ? (
                                    <div className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden bg-gray-100">
                                        <img
                                            src={item.coverImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-shrink-0 w-32 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-3xl">
                                        📰
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3
                                            className="font-bold text-gray-900 text-base leading-snug"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {item.title}
                                        </h3>
                                        <span
                                            className="flex-shrink-0 text-white text-xs px-2.5 py-1 rounded-full font-medium"
                                            style={{ backgroundColor: item.category.color }}
                                        >
                                            {item.category.name}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.excerpt}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <User size={12} /> {item.author.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-3 bg-gray-50">
                                <button
                                    onClick={() => approve(item.id)}
                                    disabled={processing === item.id}
                                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    <CheckCircle size={15} />
                                    Onayla
                                </button>
                                <button
                                    onClick={() => reject(item.id)}
                                    disabled={processing === item.id}
                                    className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    <XCircle size={15} />
                                    Reddet
                                </button>
                                {processing === item.id && (
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <RefreshCw size={12} className="animate-spin" /> İşleniyor...
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
