import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

interface Author {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    avatarUrl: string | null;
    news: { id: string; title: string; publishedAt: Date | null }[];
}

interface AuthorsGridProps {
    authors: Author[];
}

const roleGradients: Record<string, string> = {
    AUTHOR: "from-blue-600 to-blue-800",
    EDITOR: "from-purple-600 to-purple-800",
    ADMIN: "from-red-600 to-red-800",
};

const roleColors: Record<string, string> = {
    AUTHOR: "#3B82F6",
    EDITOR: "#8B5CF6",
    ADMIN: "#EF4444",
};

const roleLabels: Record<string, string> = {
    AUTHOR: "Yazar",
    EDITOR: "Editör",
    ADMIN: "Yönetici",
};

function AuthorCard({ author }: { author: Author }) {
    const initials = author.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Link href={`/yazar/${author.id}`} className="group block h-full">
            <div
                className="rounded-2xl p-5 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 border"
                style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                {/* Avatar + name row */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-shrink-0">
                        {author.avatarUrl ? (
                            <img
                                src={author.avatarUrl}
                                alt={author.name}
                                className="w-14 h-14 rounded-full object-cover"
                            />
                        ) : (
                            <div
                                className={`w-14 h-14 rounded-full bg-gradient-to-br ${roleGradients[author.role] || "from-gray-600 to-gray-800"} flex items-center justify-center text-white text-lg font-bold`}
                            >
                                {initials}
                            </div>
                        )}
                        <span
                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
                            style={{
                                backgroundColor: roleColors[author.role] || "#6b7280",
                                borderColor: "var(--bg-surface)",
                            }}
                        />
                    </div>
                    <div className="min-w-0">
                        <h3
                            className="font-bold truncate transition-colors group-hover:text-[var(--accent)] text-sm"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {author.name}
                        </h3>
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white inline-block mt-0.5"
                            style={{ backgroundColor: roleColors[author.role] || "#6b7280" }}
                        >
                            {roleLabels[author.role]}
                        </span>
                    </div>
                </div>

                {/* Bio */}
                {author.bio && (
                    <p className="text-xs leading-relaxed mb-3 flex-shrink-0 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                        {author.bio}
                    </p>
                )}

                {/* Articles */}
                <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 mb-2" style={{ color: "var(--text-faint)" }}>
                        <BookOpen size={10} /> Son Yazıları
                    </p>
                    {author.news.slice(0, 2).map((article) => (
                        <div key={article.id} className="flex items-start gap-1.5 mb-1">
                            <span className="text-[var(--accent)] mt-0.5 flex-shrink-0 text-xs">▸</span>
                            <p className="text-xs leading-snug line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                                {article.title}
                            </p>
                        </div>
                    ))}
                    {author.news.length === 0 && (
                        <p className="text-xs italic" style={{ color: "var(--text-faint)" }}>Henüz yayınlanmış yazı yok</p>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="flex items-center justify-between mt-3 pt-3 border-t"
                    style={{ borderColor: "var(--border)" }}
                >
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>{author.news.length} makale</span>
                    <span
                        className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ color: "var(--accent)" }}
                    >
                        Profili Gör <ChevronRight size={11} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export function AuthorsGrid({ authors }: AuthorsGridProps) {
    if (!authors.length) return null;

    const displayAuthors = authors.filter(a => a.news.length > 0 || a.role !== "ADMIN").slice(0, 4);
    if (!displayAuthors.length) return null;

    return (
        <section
            className="py-10 border-b"
            style={{
                borderColor: "var(--border)",
            }}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-1">Kadromuz</p>
                        <h2
                            className="text-xl md:text-2xl font-bold"
                            style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}
                        >
                            Yazarlar Köşesi ✍️
                        </h2>
                    </div>
                    <Link
                        href="/yazarlar"
                        className="hidden md:flex items-center gap-1.5 text-xs transition-colors border px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
                    >
                        Tüm Yazarlar <ChevronRight size={12} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayAuthors.map((author) => (
                        <AuthorCard key={author.id} author={author} />
                    ))}
                </div>
            </div>
        </section>
    );
}
