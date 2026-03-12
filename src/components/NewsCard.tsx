import Link from "next/link";
import { Eye, Clock, User } from "lucide-react";

interface NewsCardProps {
    id: string;
    title: string;
    excerpt: string | null;
    slug: string;
    coverImage: string | null;
    publishedAt: Date | null;
    viewCount: number;
    author: { id: string; name: string; avatarUrl?: string | null };
    category: { name: string; slug: string; color: string };
    featured?: boolean;
}

function timeAgo(date: Date | null): string {
    if (!date) return "";
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60) return "Az önce";
    if (diff < 3600) return `${Math.floor(diff / 60)}d önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}s önce`;
    return new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export function NewsCard({
    title, excerpt, slug, coverImage, publishedAt, viewCount, author, category, featured,
}: NewsCardProps) {
    if (featured) {
        return (
            <Link href={`/haber/${slug}`} className="group block">
                <article className="glass-card overflow-hidden h-full">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[16/9]">
                        {coverImage ? (
                            <img
                                src={coverImage}
                                alt={title}
                                className="card-image w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[var(--navy)] to-[var(--accent)] flex items-center justify-center">
                                <span className="text-5xl opacity-30">📰</span>
                            </div>
                        )}
                        {/* Category badge */}
                        <span
                            className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                            style={{ backgroundColor: category.color }}
                        >
                            {category.name}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <h3
                            className="font-bold text-[var(--text-primary)] text-xl leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {title}
                        </h3>
                        {excerpt && (
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-4">{excerpt}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-[var(--text-faint)]">
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--navy)] to-[var(--accent)] flex items-center justify-center text-white text-[9px] font-bold">
                                    {author?.name?.charAt(0) || "Y"}
                                </div>
                                <span className="font-medium text-[var(--text-muted)]">{author?.name || "Misafir Yazar"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1"><Clock size={10} />{timeAgo(publishedAt)}</span>
                                <span className="flex items-center gap-1"><Eye size={10} />{viewCount}</span>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    return (
        <Link href={`/haber/${slug}`} className="group block h-full">
            <article className="news-card rounded-2xl overflow-hidden h-full flex flex-col">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9] flex-shrink-0">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={title}
                            className="card-image w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--bg-surface-2)] to-[var(--bg-surface-3)] flex items-center justify-center">
                            <span className="text-4xl opacity-20">📰</span>
                        </div>
                    )}
                    {/* Category */}
                    <span
                        className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                    >
                        {category.name}
                    </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                    <h3
                        className="font-bold text-[var(--text-primary)] leading-snug mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors text-sm md:text-base"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {title}
                    </h3>
                    {excerpt && (
                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3 flex-1">
                            {excerpt}
                        </p>
                    )}
                    {/* Footer */}
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-faint)] pt-3 border-t border-[var(--border)] mt-auto">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--navy)] to-[var(--accent)] flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                                {author?.name?.charAt(0) || "Y"}
                            </div>
                            <span className="truncate font-medium text-[var(--text-muted)]">{author?.name || "Misafir Yazar"}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="flex items-center gap-0.5"><Clock size={9} />{timeAgo(publishedAt)}</span>
                            <span className="flex items-center gap-0.5"><Eye size={9} />{viewCount}</span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
