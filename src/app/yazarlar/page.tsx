import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/NewsCard";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default async function YazarlarPage() {
    const authors = await prisma.user.findMany({
        where: {
            news: { some: { status: "PUBLISHED" } },
        },
        select: {
            id: true,
            name: true,
            role: true,
            bio: true,
            avatarUrl: true,
            news: {
                where: { status: "PUBLISHED" },
                select: { id: true, title: true, publishedAt: true },
                orderBy: { publishedAt: "desc" },
                take: 5,
            },
        },
        orderBy: { createdAt: "asc" },
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-10">
                <h1
                    className="text-3xl md:text-4xl font-bold text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Yazarlar Köşesi ✍️
                </h1>
                <p className="text-gray-500 mt-2">
                    Çanakkale Haber&apos;in deneyimli yazar ve editör kadrosu
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {authors.map((author) => {
                    const authorName = author.name || "Misafir Yazar";
                    const initials = authorName
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                    return (
                        <Link key={author.id} href={`/yazar/${author.id}`} className="group block">
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center gap-4 mb-4">
                                    {author.avatarUrl ? (
                                        <img
                                            src={author.avatarUrl}
                                            alt={author.name}
                                            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a2744] to-red-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                            {initials}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                                            {authorName}
                                        </h3>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <BookOpen size={11} /> {author.news.length} makale
                                        </span>
                                    </div>
                                </div>
                                {author.bio && (
                                    <p className="text-sm text-gray-500 line-clamp-2">{author.bio}</p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
