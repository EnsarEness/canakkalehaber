import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/NewsCard";
import { BookOpen, Calendar, Mail } from "lucide-react";
import Link from "next/link";

interface Props {
    params: Promise<{ id: string }>;
}

const roleLabels: Record<string, string> = {
    AUTHOR: "Yazar",
    EDITOR: "Editör",
    ADMIN: "Yönetici",
};

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        select: { name: true },
    });
    return { title: user ? `${user.name} - Çanakkale Haber` : "Yazar bulunamadı" };
}

export default async function AuthorProfilePage({ params }: Props) {
    const { id } = await params;
    const author = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            avatarUrl: true,
            createdAt: true,
            news: {
                where: { status: "PUBLISHED" },
                include: {
                    category: true,
                    author: { select: { id: true, name: true, avatarUrl: true } },
                },
                orderBy: { publishedAt: "desc" },
            },
        },
    });

    if (!author) notFound();

    const authorName = author.name || "Misafir Yazar";
    const initials = authorName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Profile header */}
            <div className="bg-gradient-to-br from-[#1a2744] to-[#c8102e] rounded-3xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />

                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-7">
                    {/* Avatar */}
                    {author.avatarUrl ? (
                        <img
                            src={author.avatarUrl}
                            alt={author.name}
                            className="w-28 h-28 rounded-full object-cover ring-4 ring-white/30 shadow-2xl flex-shrink-0"
                        />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-4xl font-black text-white ring-4 ring-white/20 flex-shrink-0">
                            {initials}
                        </div>
                    )}

                    {/* Info */}
                    <div className="text-center md:text-left">
                        <span className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1 block">
                            {roleLabels[author.role]}
                        </span>
                        <h1
                            className="text-3xl md:text-4xl font-bold mb-3"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {author.name}
                        </h1>
                        {author.bio && (
                            <p className="text-white/70 max-w-xl leading-relaxed text-sm md:text-base">
                                {author.bio}
                            </p>
                        )}

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-5 text-sm text-white/60">
                            <span className="flex items-center gap-1.5">
                                <BookOpen size={14} />
                                {author.news.length} yayınlanan makale
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {new Date(author.createdAt).toLocaleDateString("tr-TR", {
                                    month: "long",
                                    year: "numeric",
                                })} tarihinden beri
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Articles */}
            <div>
                <h2
                    className="text-xl font-bold text-gray-900 mb-6 section-title"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Tüm Makaleler
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {author.news.map((item) => (
                        <NewsCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            excerpt={item.excerpt}
                            slug={item.slug}
                            coverImage={item.coverImage}
                            publishedAt={item.publishedAt}
                            viewCount={item.viewCount}
                            author={item.author}
                            category={item.category}
                        />
                    ))}
                </div>
                {author.news.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-4xl mb-3">✍️</p>
                        <p className="text-gray-500">Henüz yayınlanmış makale yok.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
