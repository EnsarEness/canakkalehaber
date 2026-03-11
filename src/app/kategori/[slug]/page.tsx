import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/NewsCard";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
        where: { slug },
    });

    if (!category) notFound();

    const news = await prisma.news.findMany({
        where: { categoryId: category.id, status: "PUBLISHED" },
        include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            category: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 20,
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                    <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Kategori</span>
                </div>
                <h1
                    className="text-3xl md:text-4xl font-bold text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {category.name}
                </h1>
                <p className="text-gray-500 mt-1">{news.length} haber bulundu</p>
            </div>

            {news.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-5xl mb-4">📰</p>
                    <p>Bu kategoride henüz haber yok.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
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
            )}
        </div>
    );
}
