"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Eye, RefreshCw } from "lucide-react";

interface News {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    category: { name: string; color: string };
}

const statusLabels: Record<string, { label: string; cls: string }> = {
    DRAFT: { label: "Taslak", cls: "badge-draft" },
    PENDING: { label: "Onay Bekliyor", cls: "badge-pending" },
    PUBLISHED: { label: "Yayında", cls: "badge-published" },
    REJECTED: { label: "Reddedildi", cls: "badge-rejected" },
};

export default function HaberlerimPage() {
    const { data: session } = useSession();
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    async function fetchNews() {
        setLoading(true);
        const user = session?.user as any;
        const res = await fetch(
            `/api/news?status=${filter === "ALL" ? "ALL" : filter}&authorId=${user?.id}`
        );
        const data = await res.json();
        setNews(data.news || []);
        setLoading(false);
    }

    useEffect(() => {
        if (session) {
            // Fetch all user's news
            fetch("/api/haberlerim")
                .then((r) => r.json())
                .then((d) => {
                    setNews(d || []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [session]);

    const filtered = filter === "ALL" ? news : news.filter((n) => n.status === filter);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Haberlerim
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Tüm haberlerinizi buradan takip edin</p>
                </div>
                <Link href="/panel/haber-yaz">
                    <button className="bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-800 transition-colors">
                        + Yeni Haber
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {["ALL", "DRAFT", "PENDING", "PUBLISHED", "REJECTED"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s
                                ? "bg-[#1a2744] text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {s === "ALL" ? "Tümü" : statusLabels[s].label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                        <RefreshCw size={18} className="animate-spin" /> Yükleniyor...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-4xl mb-3">📝</p>
                        <p>{filter === "ALL" ? "Henüz haber yazmadınız." : "Bu durumda haber bulunamadı."}</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Başlık</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Durum</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((news) => {
                                const { label, cls } = statusLabels[news.status] || statusLabels.DRAFT;
                                return (
                                    <tr key={news.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{news.title}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className="text-white text-xs px-2 py-0.5 rounded-full font-medium"
                                                style={{ backgroundColor: news.category.color }}
                                            >
                                                {news.category.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-400 text-xs">
                                            {new Date(news.updatedAt).toLocaleDateString("tr-TR")}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
