import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/NewsCard";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;

    const category: any = { id: "cat-mock", name: "Özel Haberler", slug, color: "#EF4444" };

    const news: any[] = [
        {
            id: "cat-news-1",
            title: "Genel Kategori Haberi",
            slug: "genel-kategori-haberi",
            excerpt: "Bu kategoriye ait örnek bir haber metni.",
            coverImage: null,
            publishedAt: new Date().toISOString(),
            author: { id: "author-1", name: "Admin", avatarUrl: null },
            category: category
        }
    ];

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
                    {news.map((item: any) => (
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
