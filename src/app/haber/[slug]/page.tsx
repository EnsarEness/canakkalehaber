import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Eye, ArrowLeft, Share2 } from "lucide-react";
import { NewsCard } from "@/components/NewsCard";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const news = await prisma.news.findUnique({
        where: { slug },
        select: { title: true, excerpt: true },
    });
    return { title: news?.title || "Haber bulunamadı" };
}

export default async function NewsDetailPage({ params }: Props) {
    const { slug } = await params;
    const news = await prisma.news.findUnique({
        where: { slug },
        include: {
            author: true,
            category: true,
        },
    });

    if (!news || news.status !== "PUBLISHED") notFound();

    // Related news
    const related = await prisma.news.findMany({
        where: {
            categoryId: news.categoryId,
            status: "PUBLISHED",
            NOT: { id: news.id },
        },
        include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            category: true,
        },
        take: 4,
        orderBy: { publishedAt: "desc" },
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main article */}
                <article className="lg:col-span-2">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Link href="/" className="hover:text-red-700 flex items-center gap-1">
                            <ArrowLeft size={14} /> Ana Sayfa
                        </Link>
                        <span>/</span>
                        <Link href={`/kategori/${news.category.slug}`} className="hover:text-red-700">
                            {news.category.name}
                        </Link>
                    </div>

                    {/* Category badge */}
                    <span
                        className="text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 inline-block"
                        style={{ backgroundColor: news.category.color }}
                    >
                        {news.category.name}
                    </span>

                    {/* Title */}
                    <h1
                        className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {news.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-lg text-gray-500 leading-relaxed mb-6 font-light border-l-4 border-red-600 pl-4">
                        {news.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#1a2744] to-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {news.author?.name?.charAt(0) || "Y"}
                            </div>
                            <span className="font-medium text-gray-700">{news.author?.name || "Misafir Yazar"}</span>
                        </div>
                        {news.publishedAt && (
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(news.publishedAt).toLocaleDateString("tr-TR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Eye size={14} /> {news.viewCount} okunma
                        </span>
                        <button className="ml-auto flex items-center gap-1 text-gray-400 hover:text-red-700 transition-colors">
                            <Share2 size={14} /> Paylaş
                        </button>
                    </div>

                    {/* Cover image */}
                    {news.coverImage && (
                        <div className="rounded-2xl overflow-hidden mb-8 shadow-md">
                            <img
                                src={news.coverImage}
                                alt={news.title}
                                className="w-full h-64 md:h-96 object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="article-content bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />

                    {/* Author card */}
                    <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#1a2744] to-red-700 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                            {news.author?.name?.charAt(0) || "Y"}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{news.author?.name || "Misafir Yazar"}</p>
                            <p className="text-xs text-red-700 font-medium capitalize mb-2">{news.author?.role || "Yazar"}</p>
                            {news.author.bio && (
                                <p className="text-sm text-gray-500">{news.author.bio}</p>
                            )}
                        </div>
                    </div>
                </article>

                {/* Sidebar - Related */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-28">
                        <h3 className="text-base font-bold text-gray-900 mb-4 section-title">
                            İlgili Haberler
                        </h3>
                        <div className="space-y-4 mt-6">
                            {related.map((item) => (
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
                    </div>
                </aside>
            </div>
        </div>
    );
}
