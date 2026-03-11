import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Clock, CheckCircle, XCircle, PenLine, CheckSquare, Eye } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        DRAFT: { label: "Taslak", cls: "badge-draft" },
        PENDING: { label: "Onay Bekliyor", cls: "badge-pending" },
        PUBLISHED: { label: "Yayında", cls: "badge-published" },
        REJECTED: { label: "Reddedildi", cls: "badge-rejected" },
    };
    const { label, cls } = map[status] || map.DRAFT;
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>
    );
}

export default async function PanelPage() {
    const session = await getServerSession(authOptions);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = session?.user as any;

    const stats = [
        { status: "PUBLISHED", _count: { id: 12 } },
        { status: "PENDING", _count: { id: 3 } },
        { status: "DRAFT", _count: { id: 1 } },
        { status: "REJECTED", _count: { id: 0 } },
    ];

    const recentNews = [
        {
            id: "panel-news-1",
            title: "Örnek Onay Bekleyen Haber",
            status: "PENDING",
            updatedAt: new Date().toISOString(),
            category: { name: "Gündem", color: "#EF4444" },
            author: { name: "Fatma Yılmaz" }
        },
        {
            id: "panel-news-2",
            title: "Örnek Yayınlanan Haber",
            status: "PUBLISHED",
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            category: { name: "Spor", color: "#10B981" },
            author: { name: "Mehmet Demir" }
        }
    ];

    const pendingCount = stats.find((s: any) => s.status === "PENDING")?._count.id || 0;
    const publishedCount = stats.find((s: any) => s.status === "PUBLISHED")?._count.id || 0;
    const draftCount = stats.find((s: any) => s.status === "DRAFT")?._count.id || 0;
    const rejectedCount = stats.find((s: any) => s.status === "REJECTED")?._count.id || 0;

    const statCards = [
        { label: "Yayında", value: publishedCount, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        { label: "Onay Bekliyor", value: pendingCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Taslak", value: draftCount, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Reddedildi", value: rejectedCount, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Hoş geldiniz, {user.name?.split(" ")[0]} 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Panel özeti ve son aktiviteleriniz</p>
                </div>
                <Link href="/panel/haber-yaz">
                    <button className="flex items-center gap-2 bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-800 transition-colors shadow-md">
                        <PenLine size={15} />
                        Haber Yaz
                    </button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                            <card.icon size={20} className={card.color} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-sm text-gray-500">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick actions for EDITOR/ADMIN */}
            {(user.role === "EDITOR" || user.role === "ADMIN") && pendingCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckSquare size={20} className="text-amber-600" />
                        <div>
                            <p className="font-semibold text-amber-900">
                                {pendingCount} haber onay bekliyor
                            </p>
                            <p className="text-xs text-amber-600">Onaylayın veya reddedin</p>
                        </div>
                    </div>
                    <Link href="/panel/onay-bekleyenler">
                        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors">
                            İncele
                        </button>
                    </Link>
                </div>
            )}

            {/* Recent news table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Son Haberler</h2>
                    <Link href="/panel/haberlerim" className="text-sm text-red-700 hover:underline">
                        Tümünü Gör
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Başlık</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                                {user.role !== "AUTHOR" && (
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Yazar</th>
                                )}
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Durum</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentNews.map((news: any) => (
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
                                    {user.role !== "AUTHOR" && (
                                        <td className="px-4 py-4 text-gray-600 text-xs">{news.author.name}</td>
                                    )}
                                    <td className="px-4 py-4">
                                        <StatusBadge status={news.status} />
                                    </td>
                                    <td className="px-4 py-4 text-gray-400 text-xs">
                                        {new Date(news.updatedAt).toLocaleDateString("tr-TR")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentNews.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <p>Henüz haber yok.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
